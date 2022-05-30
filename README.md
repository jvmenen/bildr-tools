# bildr-tools
The place for Bildr scripts to enhance the already awesome functionality of the low-code https://bildr.com developement Studio

## Installing BildrTools
Use it one session only:
- open the bildr-tools.js script file in notepad or another viewer and copy the content
- in Bildr Studio right click on the left menubar
- select "Inspect", the developer tools window will open
- goto the console view
- paste the script in the console view and hit enter.
 
BildrTools will be available as long as you don't refresh the Studio browser tab (or close it).

### or
Have it always available when you open your project:
- in Bildr Studio open the Page Headers (from left menubar)
- add a new Page Header
- Name it 'Bildr Tools' and add this script tag as the value `<script src='https://jeroenvanmenen.synology.me/bildr-tools.js'/></script>`
- save and reopen it.
- set 'Load this page header in the studio?' to Yes
- set 'Load on all root pages (pages with routes)' to Yes if you want to use BildrTools.Debug in your preview site

## Using BildrTools in the Studio
BildrTools is a functionality that is available through the developer console n the browser. Currently there is no UI integrated with Bildr Studio.
- in Bildr Studio right click on the left menubar
- select "Inspect", the developer tools window will open
- goto the console view

From here you can explore the functionality in BildrTools. For instance, if you want to see if there are flows in your project which are not used::
- type `BildrTools.Flows.findUnused()`
- hit enter
- the output will tell you which pages have unused flows

Want to check if you still have `console log` action types in your project before you release to production?
- in Bildr Studio open the Action Types (from left menubar)
- lookup the `console log` action type
- open the 3-dot menu and copy the id (something like: `4BHRAqlDpEWjOO5gmjzPmg`)
- go back to the console view
- type `BildrTools.ActionTypes.findUsage('past-consolelog-actiontype-id-here')`
- hit enter
- the output will tell you on which pages and in which flows a console log action type is used
- now you can start cleaning up :-)
- and ofcourse you can use this to check on the usage of any Action Type

For more functionality that will help you during building in Bildr Studio explore:
`BildrTools.Flows`
`BildrTools.ActionTypes`

## Using BildrTools to debug your preview site
- open your preview site (asuming you added BildrTools as a Page Header, see 'Installing BildrTools')
- right click anywhere on your preview site and select Inpect from the menu
- open the console view

Now you'r ready for some deep inspection, available via `BildrTools.Debug`
Lets start by inspecting all the values of the variables you use on your currently loaded page(s)
- type `BildrTools.Debug.ShowAllVariables()`
- hit enter
- the output will show you all your loaded pages and per page all the variables and their values. If you have a gridlist on your page you'll see the variables for all gridlist pages as well.

Want to see the order in which you flows run?
- type `BildrTools.Debug.Trace.Start()`
- hit enter
- go to your preview site and do some actions to trigger flows
- go back to the console view
- the output shows you all the flows that have been executed

you can go into more detail by turning on tracing of the actions as well
- type `BildrTools.Debug.Trace.TraceFlowsAndActions()`
- hit enter
- go to your preview site and do some actions to trigger flows and actions
- go back to the console view
- the output shows you all the flows and actions that have been executed

want to break before a flow or an action to inspect the values of the variables?
- in Bildr Studio click the 3-dot menu next to a flow (or 3-dot menu on the action)
- copy the id shown in the menu
- goto the console view
- type `BildrTools.Debug.Trace.Start()` (or don't if you are already in trace mode) and hit enter
- type `BildrTools.Debug.Trace.BreakBeforeActionID('paste-flow-or-action-id-here')`
- hit enter
- go to your preview site and do some actions that should trigger your flow or action
- the console view will popup just before the flow or action is triggered
- now you can inspect variable values by using `BildrTools.Debug.ShowAllVariables()`
- press the play button if you want to continu. You are now in step-mode which means execution will be stopped before the next flow or action is executed, giving you the option to again inspect the variable values.
- to turn of step-mode but keep tracing flows and actions type `BildrTools.Debug.Trace.StepMode.Off()`
- hit enter

Done debugging?
- type `BildrTools.Debug.Trace.Stop()`
- hit enter to stop tracing

## Feedback? Questions?


## BildrTools functionality
```
BildrTools
    .ActionTypes
        .findUsage(actionTypeId)
        
    .Debug
        .ShowAllVariables()
        
        .Trace
            .Start()
            .Stop()
            .TraceFlowsOnly()
            .TraceFlowsAndActions()
            .BreakBeforeActionID(flowId or actionId)
            .StepMode
                .On()
                .Off()
                
        .Settings
            .AutoShowVariables(boolean) 
            .ShowBildrActions(boolean)
            
    .Flows
        .findUnused()
        .findUsage(flowId),
        .findUsageOfDeletedFlows()
        .getFlowAndActions(flowId)

```
