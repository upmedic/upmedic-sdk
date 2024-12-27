
import json
import pprint
import uuid

# specific markers from specific template with 3 classes:
markers = {'pchn', 'cuk', 'niedotar'}

# path to source template
TEMPLATE_PATH = '../src/simulationData/templatePOZsymptoms_3classes.json'
# path to csv file with new nodes 
# (i.e. new symptoms added for a new disease; uploaded from google spreadsheet)
CSV_PATH = './new_nodes.csv'

import csv

# open both files
with open(TEMPLATE_PATH) as f,  open(CSV_PATH, newline='') as csvfile:
    t = json.load(f)

    # edit specific template with 3 classes: 'pchn', 'cuk', 'niedotar' -> add to classes
    # already done
    # for n in t['nodes']:
    #     n['data'].setdefault('const_id', '')
    #     n['data'].setdefault('classes', [])
    #     n['data'].setdefault('synonyms',[])
    #     contained_markers = {m for m in markers if m in n['data']['text']}
    #     for c in contained_markers:
    #         n['data']['text'] = n['data']['text'].replace(c, '').strip()
    #         n['data']['classes'].append(c)


    # add new nodes to general template
    # reader = csv.DictReader(csvfile)
    # for row in reader:
    #     node = {
    #         'id': str(uuid.uuid4()),
    #         'parent': row['parent'],
    #         'type': 'Property',
    #         'data':{
    #             'text': row['text'],
    #             'classes': row.get('classes','').split(','),
    #             'const_id': row.get('const_id',''),
    #             'synonyms': row.get('synonyms', []),
    #         }
    #     }

    # add synonyms from new nodes to general template
    reader = csv.DictReader(csvfile)
    for row in reader:
        found = False
        for n in t['nodes']:
            if n['data']['text'] == row['text']:
                found = True
                synonyms = list(row.get('synonyms','').split(',')),
                # to clarify, extend also makes list of lists
                n['data']['synonyms'].extend(synonyms), # append function makes list of lists
        if not found:
            node = {
                'id': str(uuid.uuid4()),
                'parent': row['parent'],
                'type': 'Property',
                'data':{
                    'text': row['text'],
                    'classes': row.get('classes','').split(','),
                    'const_id': row.get('const_id',''),
                    'synonyms': row.get('synonyms','').split(','),
                }
            }
            t['nodes'].append(node)
    # print(json.dumps(t, ensure_ascii=False))

# # save new template json 
NEW_JSON_PATH = '../src/simulationData/templatePOZsymptoms_addsynonyms.json'
with open(NEW_JSON_PATH, 'w') as jsonFile:
    jsonFile.write(json.dumps(t, ensure_ascii=False))
