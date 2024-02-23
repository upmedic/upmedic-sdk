# upmedic medical knowledge base (mkb)

Expert system for structured medical documentation


## Repo scope

This repo is used as a source of logic for deterministic transformations in structured medical documents.


## Konwledge base
Knowledge is encoded using JavaScript functions. upmedic reasoning engine uses them to transform documents at the time of editing them


## Reasoning engine simulator

This repo contains simple simulator of the resoning engine: 
1. read upmedic serialized report from json file
2. use all registered functions in this repository on this file
3. simulate what transformations would be applied to the resulting document


## How to add new calculation
1. add new .tsx file in knowledge directory, e.g.: example.tsx
2. import that file in knowledge/knowledgeBase.tsx
3. create object of type EngineCalculation in example.tsx (see exemplary implementations in family_medicine folder)
4. register that object in the ExpertEngine (as in examples)

## running locally
LOCAL dev webserver runs at localhost:3000. Start it using: 
`$ yarn`
`$ yarn start`


