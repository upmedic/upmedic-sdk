import {
  EngineCalculation,
  ExpertEngine,
  NodeType,
  SelectorType,
} from '../../engine';

const KDIGO2023: EngineCalculation = {
  displayName: 'KDIGO_DM_CKD_2023',
  description:
    'KDIGO 2023 Guidelines for Diabetes Management in Chronic Kidney Disease (CKD)',
  matchingSections: {
    disciplines: '*',
    categories: '*',
    languages: '*',
  },
  nodeRequirements: [
    {
      selectorType: SelectorType.CONST_ID,
      selector: 'egfr',
      nodeType: NodeType.NUMBER,
    },
    {
      selectorType: SelectorType.CONST_ID,
      selector: 'albumin_urine_mg/g',
      nodeType: NodeType.NUMBER,
    },
    {
      selectorType: SelectorType.CONST_ID,
      selector: 'albumin_urine_mg/mmol',
      nodeType: NodeType.NUMBER,
    },
  ],
  calculate: () => {
    const egfr = parseFloat(ExpertEngine.report.getNodeByConstId('egfr').data.text);
    const albumin_mg_g = parseFloat(
      ExpertEngine.report.getNodeByConstId('albumin_urine_mg/g').data.text,
    );
    const albumin_mg_mmol = parseFloat(
      ExpertEngine.report.getNodeByConstId('albumin_urine_mg/mmol').data.text,
    );
    // eGFR evaluation
    let egfr_cat: string = ''; // eGFR category - G1-G5
    let egfr_cat_comment: string = ''; // adds comment to eGFR category
    if (egfr >= 90) {
      egfr_cat = 'G1';
      egfr_cat_comment = 'prawidłowy lub zwiększony';
    } else if (egfr > 60 && egfr < 89) {
      egfr_cat = 'G2';
      egfr_cat_comment = 'nieznacznie zmniejszony';
    } else if (egfr > 45 && egfr < 59) {
      egfr_cat = 'G3a';
      egfr_cat_comment = 'nieznacznie do umiarkowanie zmniejszony';
    } else if (egfr > 30 && egfr < 44) {
      egfr_cat = 'G3b';
      egfr_cat_comment = 'umiarkowanie do znacznie zmniejszony';
    } else if (egfr >= 15 && egfr < 29) {
      egfr_cat = 'G4';
      egfr_cat_comment = 'znacznie zmniejszony';
    } else {
      egfr_cat = 'G5';
      egfr_cat_comment = 'niewydolność nerek (sprawdź, czy wpisałeś wartość eGFR)';
      // check if value was given - value "0" is default
    }
    ExpertEngine.report.addToConclusions(
      `eGFR = ${egfr}`,
      `kategoria ${egfr_cat} - ${egfr_cat_comment}`,
    );
    // albumin in urine evaluation
    let albumin_cat: string = ''; // albumin category - A1-A3
    let albumin_cat_comment: string = ''; // albumin category comment
    // add mg/mmol with "or" condition
    if (albumin_mg_g < 30) {
      albumin_cat = 'A1';
      albumin_cat_comment =
        'prawidłowa do nieznacznie zwiększonej (sprawdź, czy wpisałeś wartość albumin)';
    } else if (albumin_mg_g >= 30 && albumin_mg_g <= 299) {
      albumin_cat = 'A2';
      albumin_cat_comment = 'umiarkowanie zwiększona';
    } else {
      albumin_cat = 'A3';
      albumin_cat_comment = 'znacznie zwiększona';
    }
    ExpertEngine.report.addToConclusions(
      `albumina w moczu = ${albumin_mg_g}`,
      `kategoria ${albumin_cat} - ${albumin_cat_comment}`,
    );
    // risk level evaluation based on eGFR and albumin categories
    let risk_level: string = '';
    let risk_recommendation: string = ''; // recommendation for doctor
    if ((egfr_cat === 'G1' || egfr_cat === 'G2') && albumin_cat === 'A1') {
      risk_level = 'małe ryzyko';
      risk_recommendation = 'monitorować 1x/rok';
    } else if (
      (egfr_cat === 'G3a' && albumin_cat === 'A1') ||
      ((egfr_cat === 'G1' || egfr_cat === 'G2') && albumin_cat === 'A2')
    ) {
      risk_level = 'umiarkowanie zwiększone ryzyko';
      risk_recommendation = 'leczyć i monitorować 1x/rok';
    } else if (
      (egfr_cat === 'G3b' && albumin_cat === 'A1') ||
      (egfr_cat === 'G3a' && albumin_cat === 'A2')
    ) {
      risk_level = 'duże ryzyko';
      risk_recommendation = 'leczyć i monitorować 2x/rok';
    } else if (
      ((egfr_cat === 'G1' ||
        egfr_cat === 'G2' ||
        egfr_cat === 'G3a' ||
        egfr_cat === 'G3b') &&
        albumin_cat === 'A3') ||
      ((egfr_cat === 'G3b' || egfr_cat === 'G4') && albumin_cat === 'A2') ||
      (egfr_cat === 'G4' && albumin_cat === 'A1')
    ) {
      risk_level = 'bardzo duże ryzyko I';
      risk_recommendation = 'leczyć, monitorować 3x/rok i skierować do nefrologa';
    } else if (
      (egfr_cat === 'G4' && albumin_cat === 'A3') ||
      (egfr_cat === 'G5' &&
        (albumin_cat === 'A1' || albumin_cat === 'A2' || albumin_cat === 'A3'))
    ) {
      risk_level = 'bardzo duże ryzyko II';
      risk_recommendation = 'leczyć, monitorować 4x/rok i skierować do nefrologa';
    }
    ExpertEngine.report.addToConclusions(
      `Ryzyko progresji PChN - ${risk_level}`,
      `zalecenia - ${risk_recommendation}`,
    );
  },
};
ExpertEngine.register(KDIGO2023);
