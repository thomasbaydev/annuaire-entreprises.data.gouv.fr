import { concatNames } from './formatting';
import { categoriesJuridiques } from './categoriesJuridiques';
import { codesNaf } from './codesNAF';

export const tvaIntracommunautaire = (siren: number | string) => {
  const sirenNum = typeof siren === 'string' ? parseInt(siren, 10) : siren;
  const tvaKey = (12 + 3 * (sirenNum % 97)) % 97;
  const tvaNumber = `${tvaKey}${sirenNum}`;
  return `FR${tvaNumber}`;
};

export const managingDirector = (uniteLegale: any) => {
  return concatNames(uniteLegale.prenom_1, uniteLegale.nom);
};

export const libelleFromCodeNaf = (codeNaf: string) => {
  const formattedNaf = (codeNaf || '').replace(/[.-]/g, '');
  //@ts-ignore
  return codesNaf[formattedNaf] || 'Activité inconnue';
};

export const fullLibelleFromCodeNaf = (activite_principale: string) =>
  activite_principale
    ? `${activite_principale} - ${libelleFromCodeNaf(activite_principale)}`
    : '';

export const libelleFromCategoriesJuridiques = (categorie: string) =>
  //@ts-ignore
  categorie ? categoriesJuridiques[categorie] : '';

export const fullAdress = (etablissement: any) => {
  if (
    !etablissement.libelle_commune &&
    !etablissement.geo_l4 &&
    !etablissement.code_postal
  ) {
    return 'Adresse inconnue';
  }

  const adresse = `${etablissement.geo_l4 || ''} ${
    etablissement.code_postal || ''
  } ${etablissement.libelle_commune || ''}`;

  return adresse || 'Adresse inconnue';
};

export const getCompanyTitle = (uniteLegale: any) => {
  const isEntrepreneur = uniteLegale.categorie_juridique === '1000';
  if (isEntrepreneur) {
    return concatNames(uniteLegale.prenom_1, uniteLegale.nom);
  } else {
    if (!uniteLegale.denomination && !uniteLegale.sigle) {
      return 'Nom inconnu';
    }
    return `${uniteLegale.denomination} ${
      uniteLegale.sigle ? `(${uniteLegale.sigle})` : ''
    }`;
  }
};

export const getCompanyName = (
  denomination: string,
  prenom: string,
  nom: string,
  categorie_juridique: string,
  sigle?: string
) => {
  const isEntrepreneur = categorie_juridique === '1000';
  if (isEntrepreneur) {
    return concatNames(prenom, nom);
  } else {
    if (!denomination && !prenom && !nom && !sigle) {
      return 'Nom inconnu';
    }
    return `${denomination} ${sigle ? `(${sigle})` : ''}`;
  }
};

export const isSirenOrSiret = (str: string) => {
  return (
    str.match(/^\d{9}|\d{14}$/g) && (str.length === 9 || str.length === 14)
  );
};
