

from io import StringIO
import json
from pprint import pprint
import pandas as pd


TEMPLATE_PATH = '../src/simulationData/templatePOZsymptoms_sctid.json'
with open(TEMPLATE_PATH) as f:
    t_corrupted = json.load(f)
    for n in t_corrupted['nodes']:
        n['data'].setdefault('classes', [])
        n['data'].setdefault('const_id', '')
        pprint(n)


t = pd.read_json(StringIO(json.dumps(t_corrupted['nodes'])))
t.to_csv('t.csv')
