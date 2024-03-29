
import json
import pprint
import uuid

markers = {'pchn', 'cuk', 'niedotar'}

TEMPLATE_PATH = '../src/simulationData/templatePOZsymptoms_sctid.json'
CSV_PATH = './new_nodes.csv'
import csv

with open(TEMPLATE_PATH) as f,  open(CSV_PATH, newline='') as csvfile:
    t = json.load(f)
    for n in t['nodes']:
        n['data'].setdefault('classes', [])
        n['data'].setdefault('const_id', '')
        contained_markers = {m for m in markers if m in n['data']['text']}
        for c in contained_markers:
            n['data']['text'] = n['data']['text'].replace(c, '').strip()
            n['data']['classes'].append(c)

    reader = csv.DictReader(csvfile)
    for row in reader:
        node = {
            'id': str(uuid.uuid4()),
            'parent': row['parent'],
            'type': 'Property',
            'data':{
                'text': row['text'],
                'classes': row.get('classes','').split(','),
                'const_id': row.get('const_id',''),
                'synonymes': row.get('synonymes', []),
            }
        }
        t['nodes'].append(node)
    print(json.dumps(t, ensure_ascii=False))
        

