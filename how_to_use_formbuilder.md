# How to use formBuilder

If a form exists on a page then that pages data file will have a 'formBuilder' entry. It will look something like this:

	"formBuilder" : {
	  "id" : "loginForm",
	  "action" : "dashboard.html",
	  "method" : "get",
	  "classes" : "",
	  "fieldset" : [
	    {
	      "legend" : "Login details",
	      "visibleLegend" : false,
	      "fields" : [
	        {
	          "type" : "text",
	          "fieldid" : "login-username",
	          "name" : "login-username",
	          "label" : "User ID",
	          "enabled" : true,
	          "initialVal" : "",
	          "placeholderText" : "Enter your username"
	        },
	        {
	          "type" : "password",
	          "fieldid" : "login-password",
	          "name" : "login-password",
	          "label" : "Password",
	          "enabled" : true,
	          "initialVal" : "",
	          "placeholderText" : ""
	        }          
	      ],
	      "buttons" : [
	        {
	          "type" : "submit",
	          "enabled" : true,
	          "name" : "button",
	          "id" : "login-button",
	          "classes" : "",
	          "text" : "Login"
	        }
	      ]
	    }
	  ]
	}

If you are a content editor with no development experience, then this might look a bit scary but all it is is a nested list of text instructions to the page.

The `id`, `action`, `method` and `classes` sections can safely be ignored as they are just for the developers. However the `fieldset` item has a lot of power in it.

## What is a fieldset?

A fieldset is a collection of form elements which are grouped together by theme. For the most part only one fieldset will appear on a page, however you can actually have as many as you like.

The first thing you need to do is give the fieldset a title, this is often hidden but it's important for accessibility, in the example above, the theme all of these fields are related to login details, so 'login details' is a good name for our fieldset. You can set the title by updating the `legend` entry. If you feel it's important that the legend is visible then you can set the `visibleLegend` entry to `true`.

Once you've done that it's time to add the fields:

## Adding form fields

Inside the `fieldset` item you will see another entry called `fields` and then a square bracket `[` anything within square brackets is a collection of 'objects' this basically means that you can add as many things as you like to the collection. To add a new field simply type an opening and closing curly bracket `{}`.

IF you want to have more than one field (which I imagine you do, then every set of brackets (apart from the last one) should have a comma `,` after it,
e.g: `{},`

You can then build up your form. Inside the curly brackets, copy and paste the following text:

	  "type" : "",
	  "fieldid" : "",
	  "name" : "",
	  "label" : "",
	  "enabled" : true,
		"required" : true,
		"validation" : "default",
	  "initialVal" : "",
	  "placeholderText" : "",
	  "options" : [],
	  "error" : "",
		"help" : ""

All of those entries must exist in every field but not all of them need to be filled in.

## Explanation of entries

### Type
There are several options for type:

- **text**  
This is a standard form field, most of the fields you add will be text types.
- **textarea**  
If the user needs to enter a lot of text (more than a couple of words) then use text area instead.
- **password**  
A password type is exactly like a text type except nobody can see what is being typed in there. You see dots instead of letters. This is for security purposes.
- **select**  
The select type allows you to create a drop-down menu so users can pick from a list of options (see: options for more information)
- **checkbox**  
Creates tick boxes, there is one for each option. A user can select as many options as they want.
- **radio**  
These are exactly the same as the checkbox type with one minor difference, the user can only selection one of these.
- **dateset**
This is a custom type which creates a group of number input elements which allows you to enter a date. It's currently in the UK date format but this is easy to change if required.
- **group**
This creates a nested fieldset and allows you to build things like hidden or conditional sections. This will be documented in more detail later on in the *creating groups* section.

The 'text' type is a very versatile option as it can actually be several different types. For example if instead of typing 'text' you typed 'number' then when the user clicks on that field on a mobile, they will see a number pad instead of a normal keyboard.

For more information on what types you can replace text with see the 'HTML5 Input Types' section on [w3schools](http://www.w3schools.com/html/html_form_input_types.asp).

### Name and fieldid
The name is simply the name of the form field. In order to avoid interfering with other forms which may be on the page, it's a good idea to prefix the name with the name of the form. so on our login form example if you were to create a 'username' field, you'd set the name as `login-username`

The fieldid should be set to the same value as the name entry.

### Label
This is what the user will see to describe what the field is. So if you are creating your `login-username` field then the label would be `Username`. This can also be written as an instruction e.g: `Please enter your username:`

### Enabled
It is possible to disable form entries, by default you should leave them as `true` but if you need them to be disabled (the user can see them but can't click on them or change the data) then set this to `false`

### Required
This is is fairly straightforward. If this is set to true then the field is not optional and will display a "This field is required" error if it is not completed. If set to false then it can be left blank by the user.

### Validation
This shows how the code should be validated. The options are:

- 'default'
The default option, no validation is performed at all unless the input type determines it's own validation (eg, email or url)
- Pattern Matching
If you enter any other text into this section the code will assume that it is a regex pattern and will validate according to that. For more information on regex patterns visit http://html5pattern.com/

### InitialVal
Some fields require a value to be inserted by default, this is where you put it. If you have create a `select`, `radio` or `checkbox` type then this value should be the same as the value you want the user to see initially selected when the form loads.

**Note:** If you add an initial value to a `text` or `textarea` type then the `placeholder` value (see below) will not be visible unless the user deletes the initial value.

### Placeholder
This is usually a set of instructions on how to fill in the field. Not all users can see these so make sure they are not vital to the user, they should just be helpful hints.

Eg for username: "Enter your username here"

They will appear inside the field itself and disappear when clicked.

**Note:** Placeholders are only visible on `text` and `textarea` types.

### Options

A field doesn't have to be one item, it can also be a set of items, to specify a set, then you need to have options.

If you chose a `select`, `radio` or `checkbox` type then you need to add at least one option, you may have noticed the square brackets `[]` next to options, this is because, like `fields`, this is also a collection, so once again add the curly braces `{}` for each option.

An option looks like this:

	"name" : "option 1",
    "value" : "value 1"

#### Name
Name is the part that will be visible to the user, it is similar in purpose to the `label` entry above, however this is related to this particular option instead of the field itself. The label could be "What type of cake do you want" and the name of the option could be "Red Velvet"

#### Value
Value is what the selection represents. This won't be visible to the user and is usually specified as a site requirement (if you are in doubt, just make it the same as the name)

### Error
This is what the error message should say if the user completes the field incorrectly:

eg: "Your username cannot contain any special characters"

**Note:** You don't need to add error messages to say a field is required.

### Help
This is to offer assistance to people completing the form and will appear just below the label. So if you want to make sure people write a date correctly you could add "Please use DD/MM/YYYY" to the help field.

## Adding buttons

Each fieldset can have a collection of buttons to go with it. Like the fieldset they also have a pre-set method of being generated.

It is unlikely that a button section doesn't already exist, in fact the chances are, only the text of a button will need to be changed in the future but if it doesn't already exist, add the following code directly after the fieldset collection (if there isn't a comma after the square brackets `[]` on fieldset then makes sure to add one)

	"buttons" : [
	  {
	    "type" : "submit",
	    "enabled" : true,
	    "name" : "button",
	    "id" : "login-button",
	    "classes" : "",
	    "text" : "Login"
	  }
	]

Like fields, buttons also have a type, however there are only three button types `submit`, `reset` and `button`. The `submit` tells the form to process all the fields that have been filled in, `reset` will clear all the fields the user has entered (this is hardly ever used on websites these days) and `button` doesn't really do anything unless a developer has told it to.

When creating a new button just give it a `name` and an `id` (again the name and ID can be the same) an then change the `text` entry, this is the only part the user will see.

## Creating groups
Earlier in this document I touch upon a 'group' field type. The group type is not really a field, it is a way to add a sub-set of fields into a form. The data structure for a group looks a little bit different.

	{
		"type" : "group",
		"group" : {
			"legend" : "List any project milestones and dates they'll be met",
			"visibleLegend" : true,
			"class" : "project-milestones",
			"allowMultiple" : true,
			"groups" : []
		}
	}

As you can see above, the only field which exists in both field and group types is the 'type' field. The rest of the fields are replaced by a 'group' object.

As a group is rendered in HTML as a fieldset, a legend must be provided, by default this will appear in a similar style to a label on a normal field. However this can be changed in the CSS or if you set 'visibleLegend' to 'false' it will be hidden entirely.

All groups have a 'class' field so that the ui developer can target each group for styling/javascript. This is how a developer could make a collapsible or conditional subset.

allowMultiple will add a link at the bottom of the fieldset which says "add another", this is not hooked up to anything but can easily be added to a cms or scripted to update the page with additional sets.

The groups object contains a set of 'fields' objects which behave exactly like the fields object documented above.

There is no limit to how many nested groups you wish to create, as simply adding another 'group' type within a nested 'fields' object will create a subset of the subset.


## All done!
That's it. Your new form should have been generated!

Any issue, let me know.
