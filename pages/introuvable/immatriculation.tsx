import React from 'react';

import Page from '../../layouts';
import ButtonLink from '../../components/button';

const SirenNotFound: React.FC = () => {
  return (
    <Page small={true} title="Fiche d'immatriculation introuvable">
      <div className="content-container">
        <h1>Cette fiche d'immatriculation n‘existe pas chez nos partenaires</h1>
        <div>
          <p>Il existe plusieurs explications possibles :</p>
          <ul>
            <li>
              Les <b>entreprises individuelles et les auto-entreprises</b>, ne
              sont pas obligées d'être immatriculées. Il est donc possible que
              vous ne trouviez pas de fiche d'immatriculation pour une
              entreprise de ce type.
            </li>
            <li>
              Les <b>administrations publiques</b> peuvent également ne pas être
              immatriculées.
            </li>
            <li>
              Si l'entreprise est une entreprise artisanale,{' '}
              <a href="https://rnm.artisanat.fr/">
                contactez les Chambres des Métiers de l‘Artisanat
              </a>
            </li>
            <li>
              Si l'entreprise n‘est pas une entreprise,{' '}
              <a href="http://data.inpi.fr/">
                contactez l‘INPI qui centralise les données des Greffes des
                tribuanux de commerce.
              </a>
            </li>
          </ul>
          <p>Consultez notre FAQ pour en savoir plus.</p>
        </div>
        <div className="layout-center">
          <ButtonLink href="/faq">Consultez la FAQ</ButtonLink>
        </div>
      </div>
    </Page>
  );
};

export default SirenNotFound;
