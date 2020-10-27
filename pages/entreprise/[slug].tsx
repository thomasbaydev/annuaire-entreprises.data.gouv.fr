import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { getCompanyTitle } from '../../utils/helper';
import {
  Etablissement,
  getEtablissement,
  getUniteLegale,
  UniteLegale,
} from '../../model';
import EtablissementSection from '../../components/etablissementSection';
import EntrepriseSection from '../../components/entrepriseSection';
import EtablissementListeSection from '../../components/etablissementListeSection';
import Title from '../../components/titleSection';
import ButtonLink from '../../components/button';
import HorizontalSeparator from '../../components/horizontalSeparator';

interface IProps {
  etablissement: Etablissement;
  uniteLegale: UniteLegale;
  isEntreprise: boolean; // true if entreprise, false if etablissement
}

const About: React.FC<IProps> = ({
  etablissement,
  uniteLegale,
  isEntreprise = false,
}) => (
  <Page
    small={true}
    title={`Page entreprise - ${getCompanyTitle(uniteLegale)} - ${
      uniteLegale.siren
    }`}
  >
    <div className="content-container">
      {uniteLegale.statut_diffusion === 'N' ? (
        <>
          <h1>Cette entreprise est introuvable</h1>
          <p>
            Il est possible que cette entreprise ait demandé à ne pas figurer sur les listes de diffusion
            publique en vertu de{' '}
            <a href="https://www.legifrance.gouv.fr/affichCodeArticle.do;jsessionid=C505A51DBC1A4EB1FFF3764C69ACDB1C.tpdjo11v_1?idArticle=LEGIARTI000020165030&cidTexte=LEGITEXT000005634379&dateTexte=20100702">
              l'article A123-96 du code du commerce
            </a>
            .
          </p>
          <p>
            Pour des raisons de sécurité, certaines associations et les
            organismes relevant du Ministère de la Défense ne sont pas
            diffusibles non plus.
          </p>
          <p>
            Si cette entreprise est la votre et que vous souhaitez vous rendre
            diffusible de nouveau la démarche est à effectuer auprès de l’INSEE
            :
          </p>
          <div className="layout-center">
            <ButtonLink href="https://statut-diffusion-sirene.insee.fr/" alt>
              ⇢ Rendre mon entreprise diffusible
            </ButtonLink>
          </div>
        </>
      ) : (
                <>
                          <Title
                            name={
                              uniteLegale.statut_diffusion === 'N'
                                ? 'Nom inconnu'
                                : getCompanyTitle(uniteLegale)
                            }
                            siren={uniteLegale.siren}
                            siret={etablissement.siret}
                            isEntreprise={isEntreprise}
                            isSiege={etablissement.etat_administratif === 'A'}
                            isNonDiffusible={uniteLegale.statut_diffusion === 'N'}
                          />
                          {!isEntreprise && (
                            <EtablissementSection
                              etablissement={etablissement}
                              uniteLegale={uniteLegale}
                            />
                          )}
                          <EntrepriseSection uniteLegale={uniteLegale} />
                          <EtablissementListeSection uniteLegale={uniteLegale} />
                </>




      )}
    </div>
    <style jsx>{`
      .content-container {
        margin: 20px auto 40px;
      }
    `}</style>
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const siretOrSiren = context.params.slug;

  if (siretOrSiren && siretOrSiren.length === 9) {
    // siege social
    const uniteLegale = await getUniteLegale(siretOrSiren as string);
    return {
      props: {
        etablissement: uniteLegale.etablissement_siege || {},
        uniteLegale,
        isEntreprise: true,
      },
    };
  }

  const etablissement = await getEtablissement(siretOrSiren as string);
  const uniteLegale = await getUniteLegale(etablissement.siren as string);

  return {
    props: {
      etablissement,
      uniteLegale,
      isEntreprise: false,
    },
  };
};

export default About;
