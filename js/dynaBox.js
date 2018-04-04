/*
 *  FILE NAME:    dynaBox.js
 *  AUTHOR:       Luca Costanzi (luca.costanzi@gmail.com)
 *  --------------------------
 *  DESCRIPTION: A javascript widget for dynamically editable dropdown lists
 *
 *  This plugin binds a dropdown with a cached version of it which can be used to dynamically re-render its options.
 *  Each option is internally stored as an object which can make use of the following properties:
 *      label: (String)The text which goes between <option> tags.
 *      value: (String)The value of the <option>.
 *      group: (String)The <optgroup> where this option should be added.
 *      classHtml: (String)The html class value.
 *      idHtml: (String)The html id value.
 *      disabled: (Boolean)1 to disable the <option>.
 *      visible: (Boolean)Set to 0 to not render the <option>. (the option is kept in cache but not created as an html element).
 *      selected: (Boolean)Set to 1 to render this <option> as selected.
 *
 *  VERSIONS:
 *  1.1	Original
 */

(function(jQuery) {
    function dynaBox(item, options) {
        var fixedOptions = [];
        if (options != undefined) {
            if (jQuery.isArray(options)) {
                jQuery.each(options, function(i, v) {
                    if (!jQuery.isPlainObject(v))
                        newOption = {value: v};
                    else
                        newOption = v;
                    newOption.index = i;
                    fixedOptions.push(newOption);
                });
                opts = {values: fixedOptions};
            } else {
                jQuery.each(options.values, function(i, o) {
                    o.index = i;
                });
                opts = options;
            }
        } else {
            selected = jQuery(item)[0].selectedIndex;
            jQuery(item).children('option').each(function(k, domOpt) {
                sel = 0;
                if (k == selected)
                    sel = 1;
                fixedOptions.push({
                    index: k,
                    value: jQuery(domOpt).val(),
                    label: jQuery(domOpt).html(),
                    visible: jQuery(domOpt).is(":visible"),
                    classHtml: jQuery(domOpt).attr("class"),
                    id: jQuery(domOpt).attr("id"),
                    selected: sel
                });
            });
            opts = {values: fixedOptions};
        }
        this.options = jQuery.extend({
            values: "",
            orderBy: "id"
        }, opts);
        this.item = jQuery(item);
        this.init();
    }
    function create_option(value, label, disabled, selected, cl, id, index) {
        return "<option data-dbox-index = '" + index + "' " + cl + " " + id + " value=" + value + " " + disabled + " " + selected + " >" + label + "</option>";
    }
    function create_group(group) {
        return "<optgroup label='" + group + "'></optgroup>";
    }
    dynaBox.prototype = {
        init: function() {
            this.render();
        },
        showOptions: function() {
            console.log(this);
        },
        /**
         * Updates the given option object property with a new value
         * @param {array} The option object
         * @param {string} The property to update
         * @param {string} The new value to assign
         */
        updateObject: function(option, propertyToUpdate, newValue) {
            option[propertyToUpdate] = newValue;
        },
        add: function(list, render) {
            opts = this.options;
            jQuery.each(list, function(i, v) {
                if (!jQuery.isPlainObject(v))
                    newOption = {value: v};
                else
                    newOption = v;
                newOption.index = opts.values.length;
                opts.values.push(newOption);
            });
            if (render == undefined || render == true)
                this.render();
        },
        remove: function(selectors, render) {
            var optionsToUpdate = [];
            var temp = [];
            thisObj = this;
            if (selectors !== "all") {
                jQuery.each(selectors, function(property, values) {

                    optionsToUpdate.push(thisObj.findByProperty(property, values));
                });
                if (Object.keys(selectors).length > 1) {
                    for (i = 0; i < Object.keys(selectors).length; i++) {
                        if (optionsToUpdate[i + 1] != undefined) {
                            if (i == 0)
                                temp = $(optionsToUpdate[i]).filter(optionsToUpdate[i + 1]);
                            else
                                temp = temp.filter(optionsToUpdate[i + 1]);
                        }
                    }
                } else {
                    temp = optionsToUpdate[0];
                }
                jQuery.each(temp, function(kt, optTemp) {
                    jQuery.each(thisObj.options.values, function(k, opt) {
                        if (opt != undefined && optTemp != undefined) {
                            if (optTemp.index === opt.index) {
                                thisObj.options.values.splice(k, 1);
                            }
                        }
                    });
                });
            } else {
                temp = thisObj.options.values;
                thisObj.options.values = [];
            }
            if (render == undefined || render == true)
                thisObj.render();
        },
        render: function() {
            el = this.item;
            el.html("");
            opts = this.options;
            if (opts.linkedSel != undefined) {
                selb = opts.linkedSel;
                selb.html("");
            }
            var orderFunc = (function(a, b) {
                orderBy = this.options.orderBy;
                if (a[orderBy] < b[orderBy])
                    return -1;
                if (a[orderBy] > b[orderBy])
                    return 1;
                return 0;
            }).bind(this);
            this.options.values.sort(orderFunc);
            var groups = [];
            jQuery.each(this.options.values, function(i, v) {
                if (v.visible == undefined || v.visible !== 0) {
                    if (v.value != undefined) {
                        if (v.label === undefined)
                            v.label = v.value;
                        dis = "";
                        if (v.disabled != undefined && v.disabled == 1)
                            dis = 'disabled ="disabled"';
                        sel = "";
                        if (v.selected != undefined && v.selected == 1)
                            sel = 'selected ="selected"';
                        cl = "";
                        if (v.classHtml != undefined && v.classHtml !== "")
                            cl = 'class ="' + v.classHtml + '"';
                        id = "";
                        if (v.id != undefined && v.id != "")
                            id = 'id ="' + v.id + '"';
                        if (opts.linkedSel != undefined) {
                            if (v.link == undefined || v.link == "")
                                el.append(create_option(v.value, v.label, dis, sel, cl, id, v.index));
                            if (v.link == 1)
                                selb.append(create_option(v.value, v.label, dis, sel, cl, id, v.index));
                        } else {
                            if (v.group !== undefined) {
                                if (groups[v.group] === undefined) {
                                    groups[v.group] = $($.parseHTML(create_group(v.group)));
                                    el.append(groups[v.group]);
                                }
                                groups[v.group].append(create_option(v.value, v.label, dis, sel, cl, id, v.index));
                            } else
                                el.append(create_option(v.value, v.label, dis, sel, cl, id, v.index));
                        }
                    }
                }
            });
        },
        orderBy: function(field, render) {
            if (render == null)
                render = true;
            jQuery.extend(this.options, {orderBy: field});
            if (render)
                this.render();
        },
        findByProperty: function(property, values) {
            var toReturn = [];
            jQuery.each(this.options.values, function(key, option) {
                if (jQuery.isArray(values)) {
                    jQuery.each(values, function(keyV, value) {

                        if (option[property] != undefined && option[property] == value) {
                            toReturn.push(option);
                        }
                    });
                } else {
                    if (option[property] != undefined && option[property] == values) {
                        toReturn.push(option);
                    }
                }
            });

            return toReturn;
        },
        updateOptions: function(selectors, newValues, render) {
            if (render == null)
                render = true;
            var optionsToUpdate = [];
            var temp = [];
            thisObj = this;
            thisObj.setSelectedOptions();
            if (selectors === "all") {
                temp = thisObj.options.values;
            } else {
                jQuery.each(selectors, function(property, values) {
                    optionsToUpdate.push(thisObj.findByProperty(property, values));
                });
                if (Object.keys(selectors).length > 1) {
                    for (i = 0; i < Object.keys(selectors).length; i++) {
                        if (optionsToUpdate[i + 1] != undefined) {
                            if (i == 0)
                                temp = $(optionsToUpdate[i]).filter(optionsToUpdate[i + 1]);
                            else
                                temp = temp.filter(optionsToUpdate[i + 1]);
                        }
                    }
                } else {
                    temp = optionsToUpdate[0];
                }
            }

            jQuery.each(temp, function(k, opt) {
                jQuery.each(newValues, function(property, value) {
                    if (property !== "index")
                        opt[property] = value;
                });
            });
            if (render)
                thisObj.render();
        },
        setSelectedOptions: function() {
            thisObj = this;
            el = this.item;
            var selectedOpts = $(":selected", el);
            if (this.options.linkedSel !== undefined) {
                selectedOpts = jQuery.merge(selectedOpts, $(":selected", this.options.linkedSel));
            }
            jQuery.each(thisObj.options.values, function(k, v) {
                v.selected = "";
            });
            jQuery.each(selectedOpts, function(k, v) {
                opt = thisObj.findByProperty("index", $(v).data("dbox-index"));
                if (opt[0] !== undefined)
                    opt[0].selected = 1;
            });
        },
        linkSelects: function(select, btnObjA, btnObjB) {
            jQuery.extend(this.options, {linkedSel: jQuery(select), linkedBtnA: jQuery(btnObjA), linkedBtnB: jQuery(btnObjB)});
            el = this.item;
            values = this.options.values;

            var rightClick = (function() {
                this.setSelectedOptions();
                this.updateOptions({"selected": 1}, {link: ""});
            }).bind(this);

            var leftClick = (function() {
                this.setSelectedOptions();
                this.updateOptions({"selected": 1}, {link: 1});
            }).bind(this);

            jQuery(btnObjA).bind("click", function() {
                leftClick();
            });

            jQuery(btnObjB).bind("click", function() {
                rightClick();
            });

        }
    };

    // jQuery plugin interface
    jQuery.fn.dynaBox = function(opt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var item = jQuery(this), instance = item.data('dynaBox');
            if (!instance) {
                // create plugin instance if not created
                item.data('dynaBox', new dynaBox(this, opt));
            } else {
                // otherwise check arguments for method call
                if (typeof opt === 'string') {
                    instance[opt].apply(instance, args);
                }
            }
        });
    };

}(jQuery));
