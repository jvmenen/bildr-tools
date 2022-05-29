# bildr-tools
The place for Bildr scripts to enhance the already awesome functionality of the low-code https://bildr.com developement Studio

## Installing BildrTools
Use it a one session only:
- in Bildr Studio right click on the left menubar
- select "Inspect", the developer tools window will open
- goto the console view
- open the bildr-tools.js script file
- paste the script in the console view and hit enter. 
The BildrTools will be available as long as you don't refresh the Studio browser tab (or close it).

### or
Have it always available when you open your project:
- in Bildr Studio open the Page Headers overview (from left menubar)
- add a new Page Header
- Name it 'Bildr Tools' and add this script tag as the header `<script src='https://jeroenvanmenen.synology.me/bildr-utils.js'/>`
- save and reopen it.
- set 'Load this page header in the studio?' to Yes
- set 'Load on all root pages (pages with routes)' if you want to use BildrTools.Debug in your preview site

## Using BildrTools in the Studio
BildrTools is a functionality that is available through the developer console n the browser. Currently there is no UI integrated with Bildr Studio.
- in Bildr Studio right click on the left menubar
- select "Inspect", the developer tools window will open
- goto the console view

From here you can explore the functionality in BildrTools. For instance, if you want to see of there are flows in your project which are not used::
- type `BildrTools.Flows.findUnused()`
- hit enter
- the output will tell you which pages have unused flows

Want to check if you still have consol.log action types in your project before you release to production?
- in Bildr Studio open the Action Types (from left menubar)
- lookup the consol log action type
- open the 3-dot menu and copy the id (something like: 4BHRAqlDpEWjOO5gmjzPmg)
- go back to the console view
- type `BildrTools.ActionTypes.findUsage('past-consolelog-actiontype-id-here')`
- hit enter
- the output will tell you on which pages and in which flows a console log action type is used
- now you can start cleaning up :-)

For more see the documentation below on:
`BildrTools.Flows`
`BildrTools.ActionTypes`

## Using BildrTools in your preview site
- open your preview site (asuming you added BildrTools as a Page Header, see 'Installing BildrTools')
- right click anywhere on your site and select inpect from the menu
- open the console view

Now your ready for some deep inspection available via `BildrTools.Debug`
Lets start by inspecting all the values of the variables you use on your currently loaded page(s)
- type `BildrTools.Debug.ShowAllVariables()`
- hit enter
- the output will show you all your loaded pages and per page all the variables and their values. If you have a gridlist on your page you'll see the variables for all gridlist pages.

Want to see the order in which you flows run?
- type `BildrTools.Debug.Trace.Start()`
- hit enter
- go to your website and do some actions
- go back to the console view
- the output shows you all the flows that have been executed

youu can go into more detail by turning on tracing of the actions as well
- type `BildrTools.Debug.Trace.TraceFlowsAndActions()`
- hit enter
- go to your preview site and do some actions
- go back to the console view
- the output shows you all the flows and actions that have been executed

want to break before a flow or an action?
- in Bildr Studio click the 3-dot menu next to the flow (or 3-dot menu on the action)
- copy the id shown in the menu
- goto the console view
- type `BildrTools.Debug.Trace.Start()` (or don't ig you are already in trace mode)
- hit enter
- type `BildrTools.Debug.Trace.BreakBeforeActionID('paste-flow-or-action-id-here')`
- hit enter
- go to your preview site and do some actions that should trigger your flow or action
- the console view will popup as soon just before the flow or action is triggered
- now you can inspect variable values by using `BildrTools.Debug.ShowAllVariables()`
- press the play button of you want to proceed, you are now in step-mode. This means execution will be stopped before the next flow or action is executed, giving you the option to again inspect the variable values.

Done debugging?
- type `BildrTools.Debug.Trace.Stop()`
- hit enter to stop tracing

## Feedback? Questions?

