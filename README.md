# upmedic-sdk

[upmedic](https://www.upmedic.io) implementation of [Reporting Assistance Framework](https://www.openimagingdata.org/oidm-based-next-gen-reporting-assistance/)

**TL;DR** [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)-like abstractions for medical documentation 

upmedic-sdk is software developer kit (SDK) focused on delivering abstractions that enable developers to create applications that interact with medical documentation **while it is being created**.

Use cases:

* medical scales
* Clinical Decision Support systems
* connecting to external knowledge databases
* conclusions suggestions

![OIDM reporting](https://www.openimagingdata.org/content/images/size/w1600/2023/07/image-1.png)

## Reporting Data Context Model

Covered for you by upmedic:

* current report
* templates visible to the current user (source of coding, CDEs (Common data elements), structured reporting data)
* nlp-extracted values from current report
* collection of previous reports

## Assisted Reporting Container

By using upmedic-sdk, your code is executed by upmedic, giving you access to the content of the report that is being edited.

## Reporting System Commands

Examples in this repository show how you can interact with report content. Extract values, provide live feedback to the report creator (doctor), by a set of abstractions to make it easier for the developer not to focus on parsing textual content, but on the problem.

# Installation

`npm install upmedic-sdk`

# Getting started

## First plugin - BMI
Let's create your first Plugin using upmedic-sdk.
This will be a simple BMI calculator. When doctor fills in weight and height of a patient, it will automatically output value of BMI = weight[kg]/height[m]^2

Let's assume you have a template

```json
{
    "nodes": [
        {
            "id": "6b2849d8-b96a-4ac7-b088-09776126cbd1",
            "nodeId": "root",
            "parent": null,
            "type": "Section",
            "data": {
                "text": "BMI calculator",
                "discipline": "any",
                "category": "example"
            }
        },
        {
            "nodeId": "weight",
            "parent": "6b2849d8-b96a-4ac7-b088-09776126cbd1",
            "type": "Number",
            "data": {
                "text": "0",
                "prefix": "weight"
            }
        },
        {
            "type": "Number",
            "nodeId": "height",
            "parent": "6b2849d8-b96a-4ac7-b088-09776126cbd1",
            "data": {
                "text": "0",
                "prefix": "height"
            }
        }
    ]
}
```

It is very simple, it has a section (defines its name, is a purely structural element in this case), and two Number nodes that will be used to input weight and height. Note that both number nodes have parent set to the id of the Section.

The code (examples use typescript but upmedic-sdk works also for vanilla js) of a plugin that will calculate BMI could be:

```typescript
import {Report} from 'upmedic-sdk'

Report.events.onAllAdd(['weight','height'], function(){
    let weight = parseFloat(Report.getNodeById('weight').data.text);
    let height = parseFloat(Report.getNodeById('height').data.text);
    Report.addOrUpdateNode(
    {
        nodeId: "BMI",
        type: "Number",
        data: {"text": weight/(height*height)}
    });
});
```

onAllAdd is an event that is triggered when all of the nodes with specified Id become present in the report. If they are present and any of these nodes changes, it will also be triggered. This allows us to get current values of the measurements, perform the calculation and add a new node with the result of it.

Note that by using `nodeId=BMI`, we tell upmedic that it should first look if anything with this id is already present. If yes, do not add a new node, just update the existing one. New/update node has no parent specified. This means upmedic will add the new node at the end of the report.

## Insall-Salvati ratio

This example shows that you can achieve any branching you can think of by simply using full capabilities of the typescript. Let's implement [Insall-Salvati ratio](https://radiopaedia.org/articles/insall-salvati-ratio) calculator: 

```typescript
import {Report} from 'upmedic-sdk'

  Report.events.onAllAdd(['TL','PL'], function(){
    let TL = parseFloat(Report.getNodeById('TL').data.text);
    let PL = parseFloat(Report.getNodeById('PL').data.text);

    const IS = TL/PL;
    let res = "";
    let c = 0;
    if (IS < 0.8)
    {
      res = "patella baja: <0.8";
      c = -1;
    }
    else if (IS >=0.8 && IS <=1.2){
      res = "normal";
      c = 1;
    }
    else
    {
      res = "patella alta: >1.2"
      c = -1;
    }

    Report.addOrUpdateNode(
    {
        nodeId: "insall-salvati",
        type: "Property",
        data: {
          "text": res,
          "connotation" c
          }
    });
});
```


# Docs

## Nodes (elements of reporting ontology)

As any report or template are a tree-like structures, element they contain are called nodes. There are container nodes (their purpose is to add context, provide structure) and leaf nodes - they represent meaning.
A node can have:

* `type`
* `id` (autogenerated, changes between reports)
* `nodeId` (optional, constant, manually assigned, used for querying, unique)
* `class` (optional, constant, manually assigned, used for querying, *not* unique)
* `parent`
* `data` – shape of the `data` depends on `type`

## Node types 

### Section

Container node

Each Template used in a Report forms a Section in the Report. Sections separate documented procedures. Sections have metadata related to the discipline and category. 
upmedic-sdk allows developer to run plugins selectively   

### Subsection

Container node

Subsection refers to:
1. a task performed when reporting single procedure, e.g. Comparison, Findings, Clinical data
2. a part of the report related to an anatomical structure (which can be treated as the same as a task): e.g. Kidney, Left lung.

Subsections can be nested. There is no limit of depth, but for structural clarity reasons, nesting should not exceed 3 levels. 

### Concept

Container node

It is used to group several Properties to underline that they may have relations between each other (sometimes they can also exclude each other, but Concepts are used to convey this).

Concepts can be nested. There is no limit of depth, but for structural clarity reasons, it should be used only occasionally. 

### Property

Leaf node

Property represents a basic, atomic thought that is expressed in medical documentation. It can be a whole sentence or it can be a phrase. Usually, several sentences should be split into different Properties.


Property's parent node acts as a context for it. They are bound by "contains" relation.
If parent's text should not be present in the Report, parent node's right_visibility must be false.

*Connotation* - this parameter indicates perspective of a patient: whether an observation is positive (positive value), neutral (zero), negative (less than zero).

Many of many - there is no separate Node type for this as this idea can be expressed in the Report/Template by a Concept containing multiple Properties. User can then selec 0..* Properties from the Concept. 

### Number

Leaf node

Semantically very similar to Property, but focuses on storing number and its context: prefix and suffix.

* `prefix` - context related to the number, usually label that defines the measurement, e.g. `"mass"`
* `text` - value stored as string, e.g. `"0.14"`
* `suffix`- context related to the number, usually the unit, e.g `"kg"`

### OneOfMany

Leaf node

Set of Properties and only one of them can be selected as being true for the content of the Report.


## Events

## Event types

### Structured events

These are events that relate to the structure of the document. You can subscribe to changes using node ids. Similar to the way DOM works, but in the context of medical reporting.

### Semantic events

These events are emitted when upmedic language engine detects in the contents of the report (in the structure or in unstructured text) data of predefined shape. It tries to return the data in the shape of schema passed as their arguments.

## Node sources

Workflow of a medical practitioner, according to [IHE MRRT](http://www.ihe.net/uploadedFiles/Documents/Radiology/IHE_RAD_Suppl_MRRT.pdf) standard is split into the following contexts:

* template editing – defining how one should report in relation to a specified medical procedure, e.g. Knee MRI Template
* reporting – using the template to generate the content of a report as easily as it is possible, e.g. report created using Knee MRI template.

Node sources have almost identical structure. They differ mostly in terms of metadata.

## Template

Defines everything that can be useful for the author of report. It can contain predefined phrases, structural elements, medical scales, subsections, calculators, etc.

### Template events

* `Template.onSwitch(handler)`
* `Template.onTrigger(triggerId)`

### Accessing template data

```typescript
let node = Template.getNodeById('sleepiness'); // single node
let nodes = Template.getNodesByClass('abnormality') // array of nodes 
let allNodesInTemplate = Template.nodes // returns all nodes. Source of possible performance issues as large Templates can have ~100k nodes.
```

## Report

Very similar structure to the template. It can also have unstructured free-text phrases that are so unique, that no one bothered defining them in the template. Reports most of the times are sets of instantiated nodes of the Templates (instantiated == definitions filled with real-world data based on patient).

Let's assume you have a Template with id 'knee-MRI'. You can launch upmedic with it selected by navigating to the url:
https://www.upmedic.io/app/report-creator?loadTemplates=knee-MRI

### Accessing report data

As both Template and Report are NodeSources, they share a lot of methods for accessing nodes:

```typescript
let node = Report.getNodeById('sleepiness'); // single node
let nodes = Report.getNodesByClass('abnormality') // array of nodes 
let allNodesInReport = Report.nodes // returns all nodes currently included in the report. 
```

### Report events

* `Report.events.onAdd(nodeId, handler)`
  Fired when node with `nodeId` was added (via checklist, guided typing or created using other methods) or modified.
* `Report.events.onAllAdd(nodeIds:str[], handler)`
  Fired when all of the nodes with specified Id become present in the report. If they are present and any of these nodes changes, it will also be triggered. This allows us to get current values of the measurements based on multiple values, perform the calculation and e.g. add a new node with the result of it.
* `Report.events.onSomeAdd(nodeIds:str[], handler)`
  Fired when at least one of the nodes with specified Id become present in the report. If any of these nodes changes, it will also be triggered. This is useful when there are multiple discrete ways to express similar results in the report.

* `Report.events.onRemove(nodeId, handler)`
  Fired when node with `nodeId` is removed/unchecked
* `Report.events.onChange(nodeId, handler)`
* `Report.events.onFocus(nodeId, handler)`
* `Report.events.onGenerate(nodeId, handler)`
* `Report.events.onNavigated(nodeId, handler)`
* `Report.events.onToggle(nodeId, handler) `
* `onSemanticAdd(zodSchema, handler, partial=false)`
  pass [zod schema](https://zod.dev/) and the event is fired when upmedic lang_ai detects that the report contains information that fits passed zod schema.

Use cases:
extract knowledge from unstructured data and get an easy way of accessing it.

* `onCDEsAdd(cdesId, handler, partial=false, semantic=false)`
  Pass CDESet id (with `RDES` prefix) from [RadElement](https://radelement.org/) library.
  `partial` - when true, event is fired when any of the elements in the CDESet becomes present in the report. 

  `semantic` when false, engine focuses only on observing structured elements, so it is fired when they satisfy the definition of CDESet with `cdesId`. When true, NLP engine is involved in extracting the values from free-text (can be much slower).

  The event is also fired when the elements constituting the CDESet are **modified**.


## Historical reports collection

Currently edited report is an entity that is modified each time doctor interacts with the upmedic reporting software. However, contents of the current report can be influenced by references to historical reports. `HistoricalReportsCollection`, when properly instantiated, provides access to the historical data and allows to implement plugins that, e.g. show changes between points in time.

Let's assume you have a set of historical reports with ids `rep1`, `rep2` and `rep3`

You can launch and hydrate upmedic using their data by navigating to (url-encode HistoricalReportsCollection):
https://www.upmedic.io/app/report-creator?historicalReportsCollection%5B%5D=rep1&historicalReportsCollection%5B%5D=rep2&historicalReportsCollection%5B%5D=rep3

# Presenting results to the user

As a result of any operation on data generated by medical practitioners, one usually wants to return results. There are several ways to do it, depending on how intrusive the results should be for the content of the report. One should also take into account legal consequences related to medical digital products, clinical decision systems, etc. when using any of these methods.

## Modifying report as the result of a plugin

* `Report.addOrUpdateNode(nodeId, nodeData:Node)`
* `node.remove(nodeId)`
  When node is also in the Template - uncheck it.
  When node is not in the Template - remove it.

## Popover

Underline node text, on node hover a popover is shown. Underline style depends on severity.

* `node.popover(text, severity='info')`

severity: `error`, `warning`, `info`

## Replacement options

Replacement options are a source of modifications that can be applied to the node. Node is underlined, when user hovers, a popover with options is shown. When user clicks on an option, it is applied to the node.

* `node.replacementOptions({nodeData:Node, details:str}[])`
  Use cases: suggest modifications to the report based on contents of the report.

## Cursor position

* `node.moveCursorEnd()`
* `node.moveCursorStart()`
* `node.moveCursorAt(offset:number)`
  Offset is calculated from the beginning of node's text, not an absolute report offset.

Use cases:
Productivity improvements that expect user to dictate text in proper places depending on the contents of the report.

# Developer platform access

To get access to our rapid prototyping platform, please connect with us at contact@upmedic.io

# Feedback

This technology was created as a result of many discussions with medical facilities, IT departments and medical practitioners. However, in its current state, it is far for being completed. We are open for suggestions that will enable new, fancy use-cases, and will help us with delivering the best user experience that translates into time-savings of medical practitioners using the reporting software.

# Credits

Special thanks to OIDM led by Tarik Alkasab for being the thought-leader in our field, inspiring many innovations and getting together different stakeholders to discuss their needs.
