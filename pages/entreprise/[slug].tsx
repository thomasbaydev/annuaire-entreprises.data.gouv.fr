import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { isSirenOrSiret } from '../../utils/helper';
import { Etablissement, getUniteLegale, UniteLegale } from '../../model';
import EntrepriseSection from '../../components/entrepriseSection';
import EtablissementListeSection from '../../components/etablissementListeSection';
import Title from '../../components/titleSection';
import redirect, {
  redirectIfSiretOrSiren,
  redirectPageNotFound,
  redirectSirenIntrouvable,
} from '../../utils/redirect';
import EtablissementSection from '../../components/etablissementSection';
import StructuredData from '../../components/structuredData';
import Annonces from '../../components/annonces';
import logErrorInSentry from '../../utils/sentry';
import NonDiffusible from '../../components/nonDiffusible';

const structuredData = (uniteLegale: UniteLegale) => [
  ['Quel est le SIREN de cette entreprise?', `SIREN : ${uniteLegale.siren}`],
];

interface IProps {
  etablissement: Etablissement;
  uniteLegale: UniteLegale;
  isNonDiffusible?: boolean;
}

const About: React.FC<IProps> = ({
  etablissement,
  uniteLegale,
  isNonDiffusible,
}) => (
  <Page
    small={true}
    title={`Page entreprise - ${uniteLegale.nom_complet} - ${uniteLegale.siren}`}
    canonical={`https://annuaire-entreprises.data.gouv.fr/entreprise/${uniteLegale.page_path}`}
  >
    {/* <StructuredData data={structuredData(uniteLegale)} /> */}
    <div className="content-container">
      <Title
        name={uniteLegale.nom_complet}
        siren={uniteLegale.siren}
        siret={etablissement.siret}
        isEntreprise={true}
        isOpen={etablissement.etat_administratif_etablissement === 'A'}
        isNonDiffusible={isNonDiffusible}
      />
      {uniteLegale.statut_diffusion === 'N' ? (
        <>
          <p>
            Cette entreprise est <b>non-diffusible.</b>
          </p>
          <NonDiffusible />
        </>
      ) : (
        <>
          <EntrepriseSection uniteLegale={uniteLegale} />
          {uniteLegale.etablissement_siege && (
            <EtablissementSection
              uniteLegale={uniteLegale}
              etablissement={uniteLegale.etablissement_siege}
              usedInEntreprisePage={true}
            />
          )}
          <Annonces siren={uniteLegale.siren} />
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

const extractSiren = (slug: string) => {
  if (!slug) {
    return '';
  }
  const m = slug.match(/\d{9}/);

  return m ? m[0] : '';
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const slug = context.params.slug as string;

  const siren = extractSiren(slug);

  // does not match a siren
  if (!isSirenOrSiret(siren)) {
    redirectPageNotFound(context.res, slug);
    return { props: {} };
  }

  const uniteLegale = await getUniteLegale(siren as string);

  if (!uniteLegale) {
    redirectSirenIntrouvable(context.res, siren as string);
    return { props: {} };
  }

  return {
    props: {
      //@ts-ignore
      etablissement: uniteLegale.etablissement_siege || {},
      uniteLegale,
      isNonDiffusible: uniteLegale.statut_diffusion === 'N',
    },
  };
};

export default About;
