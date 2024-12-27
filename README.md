# upmedic-sdk
[upmedic](https://www.upmedic.io) implementation of [Reporting Assistance Framework](https://www.openimagingdata.org/oidm-based-next-gen-reporting-assistance/)

upmedic-sdk is software developer kit (SDK) focused on delivering abstractions that enable developers to create applications that interact with medical documentation **while it is being created**.

Use cases:
* medical scales
* Clinical Decision Support systems
* connecting to external knowledge databases
* conclusions suggestions

![OIDM reporting](https://www.openimagingdata.org/content/images/size/w1600/2023/07/image-1.png "")

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

## Credits
Special thanks to OIDM led by Tarik Alkasab for being the thought-leader in our field, inspiring many innovations and getting together different stakeholders to discuss their needs.
