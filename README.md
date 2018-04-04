# Dynabox
A jQuery widget for dynamically editable dropdowns

See more examples at: https://lucacostanzi.github.io/dynabox/

This plugin binds a dropdown with a cached version of it which can be used to dynamically re-render its options.
Each option is internally stored as an object which can make use of the following properties:

*   label: (String)The text which goes between `<option>` tags.
*   value: (String)The value of the `<option>`.
*   group: (String)The <optgroup> where this option should be added.
*   classHtml: (String)The html class value.
*   idHtml: (String)The html id value.
*   disabled: (Boolean)1 to disable the `<option>`.
*   visible: (Boolean)Set to 0 to not render the `<option>`. (the option is kept in cache but not created as an html element).
*   selected: (Boolean)Set to 1 to render this `<option>` as selected.

#####Example of an option object

        {
            value: "value1",
            label: "html1",
            classHtml: "selectClass",
            idHtml: "selectId",
            disabled: 0,
            visible: 1,
            selected: 1
        }
        
Which will be rendered as:

	<option value="value1" class="selectClass" id="selectId" selected="selected">html1</option>

##Initialize

###Pre-populated dropdown
Binding the plug-in to a dropdown containing a list of options will authomatically cache them and generate the list of option objects for future use.

####Html

    <select id="theSelect" name="theSelect">
        <option value="value1">html1</option>
        <option value="value2">html2</option>
        <option value="value3">html3</option>
    </select>

####Javascript

    $("#theSelect").dynaBox();
    
    
###Empty dropdown
It's also possible to initialize the plug-in by directly passing the list of options.

####Html

    <select id="theSelect" name="theSelect"></select>


####Javascript
By passing an array of values, the plugin will automatically generate a list of options with those values set both as value and label.

    $("#theSelect").dynaBox(["html1","html2","html3"]);
    
To set more fields on each option an array of objects can be passed instead.

    options = [
        {
            value: "value1",
            label: "html1",
            disabled: 1
        },
        {
            value: "value2",
            label: "html2",
            selected: 1
        },
        {
            value: "value3",
            label: "html3",
            visible: 0
        }
    ];
    $("#theSelect").dynaBox(options);


##Options

###add
Insert one or more new options to the cache. The dropdown gets re-rendered immediately with the new options unless the render parameter is set to false (true by default).

	$("#theSelect").dynaBox("add", options, [ render ]);
	
####Code examples:
Add 2 new options and set some properties:

	$("#theSelect").dynaBox("add", [
			{value: "11", label: "New option 1", visible: 1},
			{value: "12", label: "New option 2", enabled: 0}
		]);

###linkSelects
Joins the original dropdown to a second one. Allows options to be moved from one dropdown to the other one.

	$("#theSelect").dynaBox("linkSelects", dropdown , button1 , button2 );
	
####Code examples:
Link the original "#theSelect" to a second element "#theSelect1". Enable button "#btnLinkR" to move the selected options from the first to the second dropdown when clicked. "#btnLinkL" is enabled to move them back.

#####HTML
	<div id="div1">
	    <select id="theSelect" multiple="multiple"></select>
	</div>
	<div id="div2">
	    <input id="btnLinkR" type="button" value="->">
	    <input id="btnLinkL" type="button" value="<-">
	</div>
	<div id="div3">
	    <select id="theSelect1" multiple="multiple"></select>
	</div>
#####Javascript
	$("#theSelect").dynaBox("linkSelects", "#theSelect1", "#btnLinkR", "#btnLinkL");
	
	
An option can be moved from a dropdown to the other by changing its "link" property. If "link" is equal to an empty string the option will be rendered on the first dropdown, while if it's equal to "linked", it will be showed on the second.

Move the option with label "html3" to the second dropdown:

	$("#theSelect").dynaBox("updateOptions",{"label":"html3"},{"link":"linked"});
	
Move it back to the original one:

	$("#theSelect").dynaBox("updateOptions",{"label":"html3"},{"link":""});


###orderBy
Order the options by one of its properties. The dropdown gets re-rendered immediately with the desired order unless render is set to false (true by default).

Note: the options will keep to be sorted by the given option even after new renderings (ie: even after adding new values).

	$("#theSelect").dynaBox("orderBy", property , [ render ] );

####Code examples:
Order the options by label:

	$("#theSelect").dynaBox("orderBy","label");


###updateOptions
Update a property of one or more options. The dropdown gets re-rendered immediately with the given properties unless render is set to false (true by default).

	$("#theSelect").dynaBox("updateOptions", selector ,  properties , [ render ]);

####Code examples:
Set the option with label "html3" as visible:

	$("#theSelect").dynaBox("updateOptions",{"label":"html3"},{"visible":1});
	
More values for the property selector can be passed with an array.

Set the options with values "value2" and "value3" as disabled:

	$("#theSelect").dynaBox("updateOptions",{"value":["value2","value3"]},{"disabled":1});
	
Use the selector "all" to edit every option.

Enable every option but don't render the changes immediately:

	$("#theSelect").dynaBox("updateOptions","all",{"disabled":0} , false );

###remove
Remove one or more options from the cache. The html dropdown gets re-rendered immediately without the desired options unless the "render" property is set to false (true by default).

	$("#theSelect").dynaBox("remove", selector, [ render ]);
	
####Code examples:
Remove the options with class "removeMe".

	$("#theSelect").dynaBox("remove",{"classHtml":"removeMe"});
	
###render
Renders the cache.

	$("theSelect").dynaBox("render");
