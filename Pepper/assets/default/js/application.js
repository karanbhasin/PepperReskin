var Pepper = (function ($) {

    //
    // Expose Pepper methods.
    //
    return {
        //
        // Pepper.go >> Runs on page-load.
        //
        go: function () {
            for (var i in Pepper.init) {
                Pepper.init[i]();
            }
        },
        //
        // Pepper.init >> Functions run auto-magically.
        //
        init: {
            account_menu: function () {
                $('#account_link').click(function () {
                    var lnk = $(this);
                    var pos = lnk.position();
                    var top = pos.top + lnk.height() + 10;
                    var left = pos.left;
                    var menu = $('#account_menu');
                    menu.css({
                        'top': top + 'px',
                        'left': left + 'px'
                    });
                    menu.toggle();
                    lnk.toggleClass('current');

                    this.blur();
                    return false;
                });

                $(document).mousedown(function (ev) {
                    if ($(ev.target).closest('#account_menu, #account_link').length) {
                        return;
                    }

                    $('#account_menu').hide();
                });
            },
            menu_dropdown: function () {
                $('a.menu_link').click(function () {
                    var lnk = $(this);
                    var pos = lnk.position();
                    var top = pos.top + lnk.height() + 10;
                    var left = pos.left;
                    // var menu = $('#account_menu');
                    var menu = $(lnk.attr('href'));

                    menu.css({
                        'top': top + 'px',
                        'left': left + 'px'
                    });
                    menu.toggle();
                    lnk.toggleClass('current');

                    this.blur();
                    return false;
                });
            },
            // Pepper.init.switch_group
            switch_group: function () {
                if (!$('#switch_group_trigger, #switch_group_list').length) {
                    return;
                }
            },
            add_toggle: function () {
            },

            init_show_wait_buttons: function () {
                $('.show_wait').each(function (index) {
                    $(this).click(function (event) {
                        var id = $(this).attr("id");
                        Pepper.Util.showWaitBeforeSubmit(id);
                    });
                });
            },
            init_show_more_info: function () {
                $('a.show_more_info').each(function (index) {
                    $(this).click(function (event) {
                        // Stop the default event to stop. Example when clicking on the <a href=""> element, the link will not be followed
                        event.preventDefault();
                        var divToToggle = $($(this).attr("href"));
                        var link_id = "#" + $(event.target).attr("id");
                        divToToggle.toggle('fast', function () {
                            if ($(this).is(':visible')) {
                                $(event.target).text('hide additional info')
                            } else {
                                $(event.target).text('show additional info');
                                //$(link_id).addClass('show_more')
                            }
                        });
                    });
                });
            },
            init_toggle: function () {
                $('a.toggle').each(function (index) {
                    $(this).click(function (event) {
                        // Stop the default event to stop. Example when clicking on the <a href=""> element, the link will not be followed
                        event.preventDefault();
                        var divToToggle = $($(this).attr("href"));
                        var link_id = "#" + $(event.target).attr("id");
                        divToToggle.toggle('slow');
                    });
                });
            },
            init_grid_gear: function () {
                Pepper.Gear_Menu.load();
            }
        },
        Util: {
            // When an element with "id" is clicked, toggle the element with id of id_toggle
            add_toggle_element: function (id) {
                $(id).click(function (event) {
                    // Stop the default event to stop. Example when clicking on the <a href=""> element, the link will not be followed
                    //event.preventDefault();
                    var elToToggle = $(id + "_toggle");
                    elToToggle.toggle();
                });
            },
            add_toggle_show_more: function (id) {
                $(id).click(function (event) {
                    // Stop the default event to stop. Example when clicking on the <a href=""> element, the link will not be followed
                    event.preventDefault();
                    var divToToggle = $($(this).attr("href"));
                    var link_id = "#" + $(event.target).attr("id");
                    divToToggle.toggle();
                });
            },
            addToggle: function (selector, functionToCallOnSuccess) {
                $(selector).each(function (index) {
                    $(this).click(function (event) {
                        // Stop the default event to stop. Example when clicking on the <a href=""> element, the link will not be followed
                        event.preventDefault();
                        var divToToggle = $($(this).attr("href"));
                        divToToggle.toggle('slow', function () {
                            // This code will be executed after the toggle is complete
                            if (functionToCallOnSuccess) {
                                functionToCallOnSuccess(event);
                            }
                        });
                    });
                    // Add event handler for cancel
                    var divToShow = $(this).attr("href");
                    $('a[class=cancel]', divToShow).click(function () {
                        $(divToShow).hide();
                    });
                });
            },
            showFullText: function (event) {
                var src = $(event.target);
                src.next('span').show();
                src.hide();
            },
            showWaitBeforeSubmit: function (btn_id) {
                var el = $('#' + btn_id);

                function hide_button() {
                    el.attr('disabled', true).closest('span.submit_wait:first').addClass('submit_wait_active');
                }

                setTimeout(hide_button, 10);

                $(window).unload(function () {
                    el.removeAttr('disabled').closest('span.submit_wait:first').removeClass('submit_wait_active');
                });
            },
            getAllValuesFromDropDown: function (select_id) {
                var existing = '';
                $(select_id + " option").each(function () {
                    existing += $(this).val() + ',';
                });
                if (existing.substr(-1) === ",") {
                    existing = existing.substr(0, existing.length - 1);
                }
                return existing;
            }
        },

        Widget: {
            init: function () {
                $('.widget_header strong a').each(function (index) {
                    $(this).click(function (event) {
                        // Stop the default event to stop. Example when clicking on the <a href=""> element, the link will not be followed
                        event.preventDefault();
                        var divToToggle = $($(this).attr("href"));
                        var link_id = "#" + $(event.target).attr("id");

                        if (divToToggle.is(':hidden')) {
                            divToToggle.slideDown('fast');
                            $(this).removeClass('toggle_off');
                        }
                        else {
                            divToToggle.slideUp('fast');
                            $(this).addClass('toggle_off');
                        }
                    });
                });

            }
        },
        //
        // Modal: for forms.
        //
        Modal_Window: {

            init_form_modal: function () {
                if (!$('a.form_modal_trigger').length) {
                    return;
                }

                $('a.form_modal_trigger').click(function (event) {
                    event.preventDefault();

                    var el = $(this);
                    var target = el.attr('href');
                    var base_w;

                    if (el.attr('rel')) {
                        base_w = el.attr('rel');
                    }

                    $('div.form_modal_inner').each(function (index) {
                        $(this).hide();
                    });

                    $(target).show();

                    if (base_w) {
                        Pepper.Modal_Window.form_modal_open(base_w);
                    }
                    else {
                        Pepper.Modal_Window.form_modal_open();
                    }

                    var inputs = $(target).select('.initial_focus');

                    if (inputs.length) {
                        inputs[0].activate();
                    }
                });

                $('.form_modal_inner a.cancel').each(function (el) {
                    $(this).click(function (ev) {
                        ev.preventDefault();
                        form_modal_close();
                    });
                });
            },

            form_modal_open: function (base_w) {
                Pepper.Modal_Window.modal_close();
                // close_date_controls();
                Pepper.Gear_Menu.hide_gear_menu();

                $('#form_modal_wrapper').show();

                $('#form_modal_close, #form_modal_overlay').click(function () {
                    Pepper.Modal_Window.form_modal_close();
                });

                if (base_w) {
                    $('#form_modal_window').width(base_w);
                }
                else {
                    $('#form_modal_window').width('');
                }

                // Let's do some math!
                var border_w = $('#form_modal_border').getDimensions().width();
                var border_w_half = Math.floor(border_w / 2);
                var border_left = '-' + border_w_half + 'px';

                $('#form_modal_border').css('marginLeft', border_left);
            },
            //
            // Modal open: invoked by other functions.
            //
            modal_open: function (base_w) {
                Pepper.Modal_Window.form_modal_close();
                //close_date_controls();
                Pepper.Gear_Menu.hide_gear_menu();

                $('#modal_wrapper').show();

                $('#modal_close, #modal_continue, #modal_overlay').click(function () {
                    Pepper.Modal_Window.modal_close();
                });

                if (base_w) {
                    $('modal_window').width(base_w);
                }
                else {
                    $('modal_window').width('');
                }

                // Let's do some math!
                var border_w = $('#modal_border').width;
                var border_w_half = Math.floor(border_w / 2);
                var border_left = '-' + border_w_half + 'px';

                $('#modal_border').css('marginLeft', border_left);
            },
            //
            // Modal close: invoked by other functions.
            //
            modal_close: function () {
                $('#modal_wrapper').hide();
            },

            //
            // Form modal close: invoked by other functions.
            //
            form_modal_close: function () {
                if (!$('#form_modal_wrapper')) {
                    return;
                }

                $('#form_modal_wrapper').hide();
            }
        },
        //
        // Gear action menu, for <table class="grid">
        //
        Gear_Menu: {
            load: function () {
                $('a.gear_trigger').click(function (event) {
                    var el = $(this);
                    var menu = el.next('ul.grid_menu');

                    if (el.hasClass('grid_gear_active')) {
                        $('a.grid_gear_active').removeClass('grid_gear_active');
                        menu.hide();
                    } else {
                        $('a.grid_gear_active').removeClass('grid_gear_active');
                        $('ul.grid_menu').hide();
                        el.addClass('grid_gear_active');

                        // for some reason menu.show is not working so replaced it with $('ul.grid_menu').show();
                        menu.show();
                        //$('ul.grid_menu').show();

                        var menu_above = '-' + (2 + menu.height()) + 'px';
                        menu.css('marginTop', menu_above);
                        menu.css(' marginLeft', '-1px');
                    }
                });

                $('ul.grid_menu a').click(function () {
                    Pepper.Gear_Menu.hide_gear_menu();
                });

                //                $(document).bind('mousedown', function (ev) {
                //                    var el = $(this);
                //                    if (!el.parent('ul.grid_menu') && !el.hasClass('grid_gear')) {
                //                        Pepper.Gear_Menu.hide_gear_menu();
                //                    }
                //                });
            },
            hide_gear_menu: function () {
                $('ul.grid_menu').hide();
                $('a.grid_gear_active').removeClass('grid_gear_active');
                $('a.gear_trigger_active').removeClass('gear_trigger_active');
            }
        },

        Groups: {
            load: function () {
                Pepper.Groups.init_add_to_group();
            },
            init_add_to_group: function () {
                $('#ddlAddToGroup').change(function () {
                    var btn = $('#btnAddToGroup');
                    var val = $("#ddlAddToGroup").val()

                    if (val === "-1") {
                        btn.hide();
                        if ($('#addToNewGroup').is(':visible')) {
                            $('#addToNewGroup').slideUp();
                        }
                        return;
                    }

                    if (val === "new") {
                        btn.hide();
                        $('#addToNewGroup').slideDown('fast', function () {
                            $('ddlNewGroupType').focus();
                        }
                        );
                    }
                    else {
                        if (!btn.is(':visible')) {
                            btn.show();
                            if ($('#addToNewGroup').is(':visible')) {
                                $('#addToNewGroup').slideUp();
                            }
                        }
                    }
                });

                $('#form_modal_add_to_group').keydown(function (evt) {
                    var enter_key = 13;
                    if (evt.keyCode == enter_key) {
                        var btn = $('#addToNewGroup').is(':visible') ? $('#btnAddToNewGrou') : $('#btnAddToGroup');
                        btn.click();
                        return false;
                    }
                });
            }
        },

        GroupMembers: {
            load: function (event) {
                $("#txtSearch").keyup(Pepper.GroupMembers.SearchGroupMembers);
                $('.delete_group_member').each(function (index) {
                    var clicked_link_id = $(this).attr("id");
                    var groupId = $('#GroupID').val();
                    var lastIndex = clicked_link_id.lastIndexOf("_");
                    var splits = clicked_link_id.split("_");
                    var uniqueIdentifier;
                    if (splits.length >= 1) {
                        uniqueIdentifier = splits[splits.length - 1];
                    }

                    if (lastIndex != -1) {
                        var url = '/Group/' + groupId + '/GroupMember/Delete/' + uniqueIdentifier;
                        $(this).click(function (event) {
                            $.ajax({
                                type: 'get',
                                url: url,
                                beforeSend: function () {
                                    // TODO: some kind of animation indicating call is being made
                                }, success: function (data, textStatus) {
                                    // B. Update the categories with the categories from the server
                                    $('#address_book').replaceWith(data);
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    //alert(errorThrown);
                                },
                                complete: function (XMLHttpRequest, textStatus) {
                                }
                            });
                        });
                    }
                });
            },

            SearchGroupMembers: function () {
                clearTimeout(_timeoutID);
                _timeoutID = setTimeout("Pepper.GroupMembers.SearchAfterSetTimeOut()", 1000);
            },
            SearchAfterSetTimeOut: function () {
                // Make an Ajax call to get the search results
                var searchText = $('#txtSearch').val();
                var groupId = $('#GroupID').val();
                var queryString = '?searchText=' + searchText;
                var url = '/Group/' + groupId + '/GroupMember/Search' + queryString;
                $.ajax({
                    type: 'get',
                    url: url,
                    beforeSend: function () {
                        // TODO: some kind of animation indicating call is being made
                        $('#search_loading').show();
                    }, success: function (data, textStatus) {
                        // B. Update the address book with the results from the server. Replace the contents inside the address_book element with the data from the server
                        $("#address_book").html(data);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert(errorThrown);
                    },
                    complete: function (XMLHttpRequest, textStatus) {
                        $('#search_loading').hide();
                    }
                });
            }
        },
        Posts: {
            createUpdatePostOnLoad: function () {
                $('#published').each(function (index) {
                    $(this).click(function (event) {
                        var wrapper = $("#publish_wrapper");
                        if (wrapper.is(':visible')) {
                            wrapper.hide();
                        } else {
                            wrapper.show();
                        }
                    });
                });

                // Bind the datepicker control
                $('#datepicker').datepicker();
            },
            load: function () {
                //$('.posts_listing a[class=remove]').each(function (index) {
                $('a[class=remove]').each(function (index) {
                    // Add event handler for each link
                    var url = $(this).attr("href");

                    $(this).click(function (event) {
                        $.ajax({
                            type: 'get',
                            url: url,
                            beforeSend: function () {
                                // TODO: some kind of animation indicating call is being made
                            },
                            success: function (data, textStatus) {
                                // replace the #posts_listing with data
                                $("#posts_listing").replaceWith(data);
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                //alert(errorThrown);
                            },
                            complete: function (XMLHttpRequest, textStatus) {
                                //                                $('.submit_wait').removeClass('submit_wait_active').children('input').removeAttr('disabled');
                                //                                hideLoadingIndicator();
                                Pepper.Posts.load();
                            }
                        });
                    });

                });
            }
        },

        // Pepper.Tags
        Tags: {
            // INF.search_map.load
            load: function () {
                $('.link_add_control').each(function (index) {
                    // Add event handler for each link
                    var divToShow = $(this).attr("href");
                    var splits = divToShow.split("_");
                    var lastIndex = divToShow.lastIndexOf("_");
                    var identifier;
                    if (lastIndex != -1 && splits.length >= 2) {
                        identifier = splits[splits.length - 2] + '_' + splits[splits.length - 1];
                    }
                    var existingLinkId = '#link_show_existing_' + identifier;
                    var existingDivId = $(existingLinkId).attr("href");
                    var existingDiv = $(existingDivId);
                    var addInput = $('#' + identifier);

                    $(this).click(function (event) {
                        // alert(event.target.id);
                        // When we click a link, the href of the link is the same as the
                        // id of the div we need to show
                        $(divToShow).show();
                    });

                    // Link inside the present div(divtoShow) with a class of "cancel" 				
                    // when clicked should hide that div
                    $('a[class=cancel]', divToShow).click(function () {
                        $(divToShow).hide();
                        existingDiv.hide();
                        addInput.val('');
                        //$('#link_add_tag').text("Add another");

                    });

                    // the submit button inside the present div(divToshow) should trigger an ajax call
                    $('input[type=submit]', divToShow).click(function (event) {

                    });

                    if (existingDivId) {
                        $(existingLinkId).click(function (event) {
                            existingDiv.toggle();
                        });

                        $('a', existingDivId).click(function (event) {
                            var text = this.innerHTML.trim();
                            var text = addInput.val() == '' ? text : ", " + text;
                            text = addInput.val() + text;
                            addInput.val(text);
                        });
                    }
                });

                $('#link_add_slug').each(function (index) {
                    $(this).click(function (event) {
                        $($(this).attr("href")).show();
                        // Make the text of the input equal to the title
                        // seperate the " " character by "-"
                        var title = $("#title").val();
                        var splits = title.split(" ");
                        var slug = '';
                        for (var i = 0; i < splits.length; i++) {
                            slug = slug + splits[i];
                            if (i != splits.length - 1) {
                                slug += '-';
                            }
                        }
                        var slugTextBox = $("#Slug");
                        slugTextBox.val(slug);
                        slugTextBox.focus().select();
                    });
                });
            }
        },


        Categories: {
            load: function () {
                // Bind the "Delete" links
                $('.delete_category').each(function (index) {
                    //A. Make an ajax call to the server to delete the category, and the response contains all the categories, which we will update in B.
                    var clicked_link_id = $(this).attr("id");
                    var lastIndex = clicked_link_id.lastIndexOf("_");
                    var splits = clicked_link_id.split("_");
                    var uniqueIdentifier;
                    if (splits.length >= 1) {
                        uniqueIdentifier = splits[splits.length - 1];
                    }

                    if (lastIndex != -1) {
                        var url = '/Category/delete/' + uniqueIdentifier;
                        $(this).click(function (event) {
                            $.ajax({
                                type: 'get',
                                url: url,
                                beforeSend: function () {
                                    // TODO: some kind of animation indicating call is being made
                                }, success: function (data, textStatus) {
                                    // B. Update the categories with the categories from the server
                                    $('#categories').replaceWith(data);
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    //alert(errorThrown);
                                },
                                complete: function (XMLHttpRequest, textStatus) {
                                }
                            });
                        });
                    }
                });

                //Bind the cancel(Done) link in the cloned row. This would undo what EDIT link does
                $('.cloned_cancel').each(function (index) {
                    $(this).click(function (event) {
                        // Get the Id of the cloned row. The cloned row (tr) should be the nearest parent
                        var nearestTr = $(this).closest('tr');
                        var row_Id = nearestTr.attr("id");
                        var lastIndex = row_Id.lastIndexOf("_");
                        var splits = row_Id.split("_");
                        var uniqueIdentifier;
                        if (splits.length >= 1) {
                            uniqueIdentifier = splits[splits.length - 1];
                        }

                        if (lastIndex != -1) {
                            // remove the cloned row
                            $("#cloned_category_" + uniqueIdentifier).remove();
                            // make the original row ( which held the edit link visible again
                            $('#category_' + uniqueIdentifier).show();

                        }
                    });
                });

                //Bind the submit button so that we can make an ajax call to update the category
                $('.cloned_submit').each(function (index) {
                    $(this).click(function (event) {
                        // Get the Id of the cloned row. The cloned row (tr) should be the nearest parent
                        var nearestTr = $(this).closest('tr');
                        var row_Id = nearestTr.attr("id");
                        var lastIndex = row_Id.lastIndexOf("_");
                        var splits = row_Id.split("_");
                        var uniqueIdentifier;
                        if (splits.length >= 1) {
                            uniqueIdentifier = splits[splits.length - 1];
                        }

                        if (lastIndex != -1) {
                            var category = $('#cloned_category_' + uniqueIdentifier + ' input[name=category]');
                            var data = 'category=' + category.val();

                            var url = '/Category/Update/' + uniqueIdentifier;
                            $.ajax({
                                type: 'post',
                                url: url,
                                data: data,
                                beforeSend: function () {
                                    // TODO: some kind of animation indicating call is being made
                                },
                                success: function (data, textStatus) {
                                    $('#categories').replaceWith(data);
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    //alert(errorThrown);
                                },
                                complete: function (XMLHttpRequest, textStatus) {
                                }
                            });
                        }
                    });
                });

                // Bind the "Edit" links
                $('.edit_category').each(function (index) {
                    // Clone the editing row and place it in place of the current row, and also make the current row invisible
                    //category_<%= cat.Id %>
                    var clicked_link_id = $(this).attr("id");
                    var lastIndex = clicked_link_id.lastIndexOf("_");
                    var splits = clicked_link_id.split("_");
                    var uniqueIdentifier;
                    if (splits.length >= 1) {
                        uniqueIdentifier = splits[splits.length - 1];
                    }

                    $(this).click(function (event) {
                        // first clone the element
                        var clonedEl = $('.cloned_category').clone(true);
                        // Next, change the id of the row by appending the category uid at the end
                        clonedEl.attr("id", "cloned_category_" + uniqueIdentifier);
                        clonedEl.removeClass('cloned_category');
                        // make the cloned row visible
                        clonedEl.show();
                        // add the cloned row to below the row which holds the edit link
                        var idOfRowToHide = '#category_' + uniqueIdentifier;
                        $(idOfRowToHide).after(clonedEl);
                        // change the id of the submit button inside the cloned row unique. I dont know if i need to do this, but if i dont do that, then the submit button doesnt work
                        // Also note that the way we are looking for that submit button ( find id of the row which we just added(the id also being just added))
                        var submit = $('#cloned_category_' + uniqueIdentifier + ' input[type=submit]');
                        submit.attr("id", "cloned_submit_" + uniqueIdentifier);
                        // make the row which holds the edit link invisible
                        $(idOfRowToHide).hide();
                        var content = $('#td_category_' + uniqueIdentifier).contents().filter(function () {
                            return this.nodeType == 3;
                        });
                        var input = $('#cloned_category_' + uniqueIdentifier + ' input[name=category]');
                        input.val(content.text().trim()).focus().select();
                    });
                });
            },
            Create: function (frm) {
                //Get the data from all the fields  
                var url = $(frm).attr("action");
                var form_id = $(frm).attr("id");

                var form_selector = '#' + form_id + ' ';

                var category = $(form_selector + 'input[name=category]');
                var data = 'category=' + category.val();


                //var url = "/comments";
                // Make an Ajax call to create a new Comment
                $.ajax({
                    type: 'post',
                    url: url,
                    //pass the data           
                    data: data,
                    beforeSend: function () {
                        // TODO: some kind of animation indicating call is being made
                    }, success: function (data, textStatus) {
                        // B. Replace the categories div with data from the server
                        $("#categories").replaceWith(data);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert(errorThrown);
                    },
                    complete: function (XMLHttpRequest, textStatus) {
                    }
                });
            }
        },

        CategoriesAndTags: {
            load: function (name, plural) {
                // Bind the "Delete" links
                $('.delete_' + name).each(function (index) {
                    //A. Make an ajax call to the server to delete, and the response contains the data, which we will update in B.
                    var clicked_link_id = $(this).attr("id");
                    var lastIndex = clicked_link_id.lastIndexOf("_");
                    var splits = clicked_link_id.split("_");
                    var uniqueIdentifier;
                    if (splits.length >= 1) {
                        uniqueIdentifier = splits[splits.length - 1];
                    }

                    if (lastIndex != -1) {
                        var url = '/' + name + '/delete/' + uniqueIdentifier;
                        $(this).click(function (event) {
                            $.ajax({
                                type: 'get',
                                url: url,
                                beforeSend: function () {
                                    // TODO: some kind of animation indicating call is being made
                                }, success: function (data, textStatus) {
                                    // B. Update the categories with the categories from the server
                                    $('#' + plural).replaceWith(data);
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                },
                                complete: function (XMLHttpRequest, textStatus) {
                                }
                            });
                        });
                    }
                });

                //Bind the cancel(Done) link in the cloned row. This would undo what EDIT link does
                $('.cloned_cancel').each(function (index) {
                    $(this).click(function (event) {
                        // Get the Id of the cloned row. The cloned row (tr) should be the nearest parent
                        var nearestTr = $(this).closest('tr');
                        var row_Id = nearestTr.attr("id");
                        var lastIndex = row_Id.lastIndexOf("_");
                        var splits = row_Id.split("_");
                        var uniqueIdentifier;
                        if (splits.length >= 1) {
                            uniqueIdentifier = splits[splits.length - 1];
                        }

                        if (lastIndex != -1) {
                            // remove the cloned row
                            $('#cloned_' + name + '_' + uniqueIdentifier).remove();
                            // make the original row ( which held the edit link visible again
                            $('#' + name + '_' + uniqueIdentifier).show();

                        }
                    });
                });

                //Bind the submit button so that we can make an ajax call to update the category
                $('.cloned_submit').each(function (index) {
                    $(this).click(function (event) {
                        // Get the Id of the cloned row. The cloned row (tr) should be the nearest parent
                        var nearestTr = $(this).closest('tr');
                        var row_Id = nearestTr.attr("id");
                        var lastIndex = row_Id.lastIndexOf("_");
                        var splits = row_Id.split("_");
                        var uniqueIdentifier;
                        if (splits.length >= 1) {
                            uniqueIdentifier = splits[splits.length - 1];
                        }

                        if (lastIndex != -1) {
                            var submit_data = $('#cloned_' + name + '_' + uniqueIdentifier + ' input[name=' + name + ']');
                            var data = name + '=' + submit_data.val();

                            var url = '/' + name + '/Update/' + uniqueIdentifier;
                            $.ajax({
                                type: 'post',
                                url: url,
                                data: data,
                                beforeSend: function () {
                                    // TODO: some kind of animation indicating call is being made
                                },
                                success: function (data, textStatus) {
                                    $('#' + plural + '').replaceWith(data);
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {

                                },
                                complete: function (XMLHttpRequest, textStatus) {
                                }
                            });
                        }
                    });
                });

                // Bind the "Edit" links
                $('.edit_' + name).each(function (index) {
                    // Clone the editing row and place it in place of the current row, and also make the current row invisible
                    var clicked_link_id = $(this).attr("id");
                    var lastIndex = clicked_link_id.lastIndexOf("_");
                    var splits = clicked_link_id.split("_");
                    var uniqueIdentifier;
                    if (splits.length >= 1) {
                        uniqueIdentifier = splits[splits.length - 1];
                    }

                    $(this).click(function (event) {
                        // first clone the element
                        var clonedEl = $('.cloned_' + name).clone(true);
                        // Next, change the id of the row by appending the category uid at the end
                        clonedEl.attr("id", "cloned_" + name + "_" + uniqueIdentifier);
                        clonedEl.removeClass('cloned_' + name);
                        // make the cloned row visible
                        clonedEl.show();
                        // add the cloned row to below the row which holds the edit link
                        var idOfRowToHide = '#' + name + '_' + uniqueIdentifier;
                        $(idOfRowToHide).after(clonedEl);
                        // change the id of the submit button inside the cloned row unique. I dont know if i need to do this, but if i dont do that, then the submit button doesnt work
                        // Also note that the way we are looking for that submit button ( find id of the row which we just added(the id also being just added))
                        var submit = $('#cloned_' + name + '_' + uniqueIdentifier + ' input[type=submit]');
                        submit.attr("id", "cloned_submit_" + uniqueIdentifier);
                        // make the row which holds the edit link invisible
                        $(idOfRowToHide).hide();
                        var content = $('#td_' + name + '_' + uniqueIdentifier).contents().filter(function () {
                            return this.nodeType == 3;
                        });
                        var input = $('#cloned_' + name + '_' + uniqueIdentifier + ' input[name=' + name + ']');
                        input.val(content.text().trim()).focus().select();
                    });
                });
            },
            Create: function (frm, name, plural) {
                //Get the data from all the fields  
                var url = $(frm).attr("action");
                var form_id = $(frm).attr("id");

                var form_selector = '#' + form_id + ' ';

                var submit_data = $(form_selector + 'input[name=' + name + ']');
                var data = name + '=' + submit_data.val();


                //var url = "/comments";
                // Make an Ajax call to create a new Comment
                $.ajax({
                    type: 'post',
                    url: url,
                    //pass the data           
                    data: data,
                    beforeSend: function () {
                        // TODO: some kind of animation indicating call is being made
                    }, success: function (data, textStatus) {
                        // B. Replace the categories div with data from the server
                        $("#" + plural).replaceWith(data);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert(errorThrown);
                    },
                    complete: function (XMLHttpRequest, textStatus) {
                    }
                });
            }
        },

        EmailTemplate: {
            load: function () {
                $('a.merge_field').each(function (index) {
                    // Clone the editing row and place it in place of the current row, and also make the current row invisible
                    var clicked_link_id = $(this).attr("id");
                    var lastIndex = clicked_link_id.lastIndexOf("_");
                    var splits = clicked_link_id.split("_");
                    var uniqueIdentifier;
                    if (splits.length >= 1) {
                        uniqueIdentifier = splits[splits.length - 1];
                    }

                    $(this).click(function (event) {
                        var text = $(this).attr('data-value');
                        tinyMCE.execInstanceCommand('tiny_mce', 'mceInsertContent', false, text);
                    });
                });
            },

            GetMergeFieldsForType: function (frm) {
                //Get the selected value from the drop down list
                var selectedVal = $("#mergefieldtypes :selected").val();
                var url = "/EmailTemplate/GetMergeFieldsForType/" + selectedVal;
                // All the existing option values
                var existing = '';
                $("#mergefieldtypes option").each(function () {
                    existing += $(this).val() + ',';
                });
                existing = "existing=" + existing;
                // Make an Ajax call to get the merge fields
                $.ajax({
                    type: 'get',
                    url: url,
                    data: existing,
                    beforeSend: function () {
                        // TODO: some kind of animation indicating call is being made
                    }, success: function (data, textStatus) {
                        // B. Replace the categories div with data from the server
                        $("#merge_fields").html(data);
                        // Update the available_merge_field_types hidden field.
                        var allvals = Pepper.Util.getAllValuesFromDropDown('#mergefieldtypes');
                        $('#available_merge_field_types').val(allvals);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert(errorThrown);
                    },
                    complete: function (XMLHttpRequest, textStatus) {
                    }
                });
            }
        },

        Email: {
            load: function () {
                $("#email_template").change(function (event) {
                    var disabled = $(this).attr("selectedIndex") == 0;
                    $('#choose_email_template').attr("disabled", disabled);
                });

                if ($('#choose_email_template')) {
                    $('#choose_email_template').click(function (event) {
                        // Ajax call #1: Get the MergeFields
                        var url = '/EmailTemplate/GetSelectedTemplate/' + $("#email_template").val();
                        $.ajax({
                            type: 'get',
                            url: url,
                            beforeSend: function () {
                                // TODO: some kind of animation indicating call is being made
                            },
                            success: function (data, textStatus) {
                                // replace the contents inside #comment_<id_of_comment_being_edited> with data
                                //tinyMCE.get('rich_text_editor').setContent(response.responseText);
                                //$('hidMergeFieldExist').value = "True";
                                $("#merge_fields").html(data);
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                alert('Error - an error occured while retrieving the template.' + errorThrown);
                            },
                            complete: function (XMLHttpRequest, textStatus) {
                                $('et_wait').hide();
                            }
                        });

                        // Ajax call #2: Get the template content
                        url = '/EmailTemplate/GetEmailTemplateContent/' + $("#email_template").val();
                        $.ajax({
                            type: 'get',
                            url: url,
                            beforeSend: function () {
                                // TODO: some kind of animation indicating call is being made
                            },
                            success: function (data, textStatus) {
                                tinyMCE.get('tiny_mce').setContent(data);
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                alert('Error - an error occured while retrieving the template.' + errorThrown);
                            },
                            complete: function (XMLHttpRequest, textStatus) {
                                $('et_wait').hide();
                            }
                        });
                    });
                }

                $('a', '#attachments').each(function (index) {
                    $(this).click(function (event) {
                        var attachment = $(this).attr("data-id");
                        var url = "/Email/DeleteAttachment/" + attachment;
                        $.ajax({
                            type: 'get',
                            url: url,
                            beforeSend: function () {
                                // TODO: some kind of animation indicating call is being made
                            },
                            success: function (data, textStatus) {
                                // replace the #attachments with data
                                $("#attachments").replaceWith(data);
                                $('#attachment_upload_wrapper').hide();
                                $('#add_attachment').show();
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                            },
                            complete: function (XMLHttpRequest, textStatus) {
                            }
                        });
                    });
                });
            }
        },

        EmailRecipients: {
            load: function (event) {
                Pepper.Util.addToggle('.toggle_link');
                $("#txtSearch").keyup(Pepper.EmailRecipients.Search);
                $("#btnAddIndividual").click(Pepper.EmailRecipients.AddIndividual);
                //                Event.observe("btnSearch", 'click', function (event) { Recipients.Search(); }, false);
                //                Event.observe("txtSearch", 'keydown', function (event) { EnterKeyEventHandler(event, function () { Recipients.Search(); }); }, false);
                //                Event.observe("lbSearchResults", 'keydown', function (event) { ListBox_onKeyDown(event, "btnAddIndividual"); }, false);
                //                Event.observe("btnAddIndividual", 'click', function (event) { Recipients.AddIndividual(); }, false);
                //                Event.observe("btnAddGroup", 'click', function (event) { Recipients.AddGroup(); }, false);

                //                $('txtSearch').focus();

                //                $$('#criteria_options a').invoke('observe', 'click', function (ev) {
                //                    Event.stop(ev);
                //                    var el = Event.element(ev);
                //                    $$('#criteria_options a').invoke('removeClassName', 'current');
                //                    el.addClassName('current');
                //                    var target = el.readAttribute('href').replace('#', '');
                //                    $(target).show().siblings().invoke('hide');

                //                    return false;
                //                });
                ////
            },

            Search: function () {
                clearTimeout(_timeoutID);
                _timeoutID = setTimeout("Pepper.EmailRecipients.SearchAfterSetTimeOut()", 1000);
            },
            SearchAfterSetTimeOut: function () {
                // Make an Ajax call to get the search results
                var searchText = $('#txtSearch').val();
                var queryString = '?searchText=' + searchText;
                if ($('#for_family').is(':checked')) {
                    queryString += '&for_family=true';
                }
                var url = '/Family/Search' + queryString;
                $.ajax({
                    type: 'get',
                    url: url,
                    beforeSend: function () {
                        // TODO: some kind of animation indicating call is being made
                        $('#search_loading').show();
                    }, success: function (data, textStatus) {
                        // B. Update the address book with the results from the server. Replace the contents inside the address_book element with the data from the server
                        $("#address_book").html(data);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert(errorThrown);
                    },
                    complete: function (XMLHttpRequest, textStatus) {
                        $('#search_loading').hide();
                    }
                });
            },
            AddIndividual: function () {
                // Find the ids of the chosen contacts

                // For each checkbox with a class of imacheckbox, gets its value
                var selectedCB = [];
                $('.imacheckbox').each(function (index) {
                    if ($(this).is(':checked')) {
                        selectedCB.push($(this).val());
                    }
                });

                // Prepare data to be sent to the server

                var searchText = $('#txtSearch').val();
                var data = 'searchText=' + searchText;
                if ($('#for_family').is(':checked')) {
                    data += '&for_family=true';
                }
                data += '&selectedContacts=' + selectedCB.join();
                var url = '/Family/AddRecipients';
                $.ajax({
                    type: 'post',
                    url: url,
                    data: data,
                    beforeSend: function () {
                        // TODO: some kind of animation indicating call is being made
                        $('#add_person_loading').show();
                    }, success: function (data, textStatus) {
                        // B. Update the recipients. Replace the contents inside the chosen_recipients div element with the data from the server
                        $("#chosen_recipients").html(data);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert(errorThrown);
                    },
                    complete: function (XMLHttpRequest, textStatus) { // complete ls like the finally block
                        $('#add_person_loading').hide();
                    }
                });
            },
            BindDeleteRecipients: function () {
                $('.remove_recipient').each(function (index) {
                    var url = $(this).attr("href");
                    $(this).click(function (event) {
                        event.preventDefault();
                        $.ajax({
                            type: 'get',
                            url: url,
                            beforeSend: function () {
                                // TODO: some kind of animation indicating call is being made
                            }, success: function (data, textStatus) {
                                $("#chosen_recipients").html(data);
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                            },
                            complete: function (XMLHttpRequest, textStatus) {
                            }
                        });
                    });
                });
            }
        },

        Comments: {
            CancelEdit: function () {
                $('.cancel').each(function (index) {
                    //A. Make an ajax call to the server to get the Editing control with the content as the current comment we are trying to edit
                    var clicked_link_id = $(this).attr("href");
                    var lastIndex = clicked_link_id.lastIndexOf("_");
                    var splits = clicked_link_id.split("_");
                    var uniqueIdentifier;
                    if (splits.length >= 2) {
                        uniqueIdentifier = splits[splits.length - 2];
                    }
                    if (lastIndex != -1) {
                        var id_of_comment_being_edited = clicked_link_id.substr(lastIndex + 1);
                        var url = '/Blog/' + uniqueIdentifier + '/comments/' + id_of_comment_being_edited + '/CancelEditComment';
                        $(this).click(function (event) {
                            $.ajax({
                                type: 'get',
                                url: url,
                                beforeSend: function () {
                                    // TODO: some kind of animation indicating call is being made
                                },
                                success: function (data, textStatus) {
                                    // replace the contents inside #comment_<id_of_comment_being_edited> with data
                                    $("#comment_" + id_of_comment_being_edited).html(data);
                                    Pepper.Comments.load();
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    //alert(errorThrown);
                                },
                                complete: function (XMLHttpRequest, textStatus) {
                                    //                                $('.submit_wait').removeClass('submit_wait_active').children('input').removeAttr('disabled');
                                    //                                hideLoadingIndicator();
                                }
                            });
                        });
                    }
                });
            },
            load: function (event) {
                // get id divToToggle and get the text area inside the div and set the focus there

                Pepper.Util.addToggle('.add_comment_link');
                $('.widget_header strong a').each(function (index) {
                    $(this).click(function (event) {
                        var divToToggle = $($(this).attr("href"));
                        var anchor = $(this);
                        divToToggle.toggle('slow', function () {
                            if (divToToggle.is(':visible')) {
                                anchor.removeClass('toggle_off');
                            } else {
                                anchor.addClass('toggle_off');
                            }
                        });
                    });
                });

                // Bind the "Edit" links
                $('.edit_comment').each(function (index) {
                    //A. Make an ajax call to the server to get the Editing control with the content as the current comment we are trying to edit
                    var clicked_link_id = $(this).attr("id");
                    var lastIndex = clicked_link_id.lastIndexOf("_");
                    var splits = clicked_link_id.split("_");
                    var uniqueIdentifier;
                    if (splits.length >= 2) {
                        uniqueIdentifier = splits[splits.length - 2];
                    }
                    if (lastIndex != -1) {
                        var id_of_comment_being_edited = clicked_link_id.substr(lastIndex + 1);
                        var url = '/Blog/' + uniqueIdentifier + '/comments/' + id_of_comment_being_edited + '/edit';
                        $(this).click(function (event) {
                            $.ajax({
                                type: 'get',
                                url: url,
                                beforeSend: function () {
                                    // TODO: some kind of animation indicating call is being made
                                },
                                success: function (data, textStatus) {
                                    // replace the contents inside #comment_<id_of_comment_being_edited> with data
                                    $("#comment_" + id_of_comment_being_edited).html(data);
                                    Pepper.Comments.load();
                                    Pepper.Comments.CancelEdit();
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    //alert(errorThrown);
                                },
                                complete: function (XMLHttpRequest, textStatus) {
                                    //                                $('.submit_wait').removeClass('submit_wait_active').children('input').removeAttr('disabled');
                                    //                                hideLoadingIndicator();
                                }
                            });
                        });
                    }
                });
                // Bind the "Delete" links
                $('.delete_comment').each(function (index) {
                    //A. Make an ajax call to the server to delete the comment, and the response contains all the comments for the existing post, which we will update in B.
                    var clicked_link_id = $(this).attr("id");
                    var lastIndex = clicked_link_id.lastIndexOf("_");
                    var splits = clicked_link_id.split("_");
                    var uniqueIdentifier;
                    if (splits.length >= 2) {
                        uniqueIdentifier = splits[splits.length - 2];
                    }

                    if (lastIndex != -1) {
                        var id_of_comment_being_edited = clicked_link_id.substr(lastIndex + 1);
                        var url = '/Blog/' + uniqueIdentifier + '/comments/' + id_of_comment_being_edited + '/delete';
                        $(this).click(function (event) {
                            $.ajax({
                                type: 'get',
                                url: url,
                                beforeSend: function () {
                                    // TODO: some kind of animation indicating call is being made
                                }, success: function (data, textStatus) {
                                    // B. Update the comments section with the commesnt from the server
                                    // replace the contents inside #comment_<id_of_comment_being_edited> with data
                                    $("#comments_" + uniqueIdentifier).html(data);
                                    Pepper.Comments.load();
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    //alert(errorThrown);
                                },
                                complete: function (XMLHttpRequest, textStatus) {
                                    //                                $('.submit_wait').removeClass('submit_wait_active').children('input').removeAttr('disabled');
                                    //                                hideLoadingIndicator();
                                }
                            });
                        });
                    }
                });
            },
            Create: function (frm) {
                //Get the data from all the fields  
                var url = $(frm).attr("action");
                var form_id = $(frm).attr("id");
                var lastIndex = form_id.lastIndexOf("_");
                if (lastIndex != -1) {
                    var uniqueIdentifier = form_id.substr(lastIndex + 1);

                    var form_selector = '#' + form_id + ' ';

                    var author = $(form_selector + 'input[name=Author]');
                    var email = $(form_selector + 'input[name=Email]');
                    var content = $(form_selector + 'textarea[name=content]');
                    var data = 'author=' + author.val() + '&email=' + email.val() + '&content=' + encodeURIComponent(content.val());


                    //var url = "/comments";
                    // Make an Ajax call to create a new Comment
                    $.ajax({
                        type: 'post',
                        url: url,
                        //pass the data           
                        data: data,
                        beforeSend: function () {
                            // TODO: some kind of animation indicating call is being made
                        }, success: function (data, textStatus) {
                            // B. Update the comments section with the commesnt from the server
                            $("#comments_" + uniqueIdentifier).html(data);
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert(errorThrown);
                        },
                        complete: function (XMLHttpRequest, textStatus) {
                            //                                $('.submit_wait').removeClass('submit_wait_active').children('input').removeAttr('disabled');
                            //                                hideLoadingIndicator();
                        }
                    });
                }
            },
            ToggleAddComment: function () {
                var elem = $('#add_a_comment');
                new Effect.toggle(elem, 'slide', { duration: 0.5, afterFinish: function () {
                    if (elem.visible()) {
                        $('txtNoteText').focus();
                    }
                }
                });


                var elem = $('#add_a_comment');
                elem.toggle('slow', function () {
                    // After toggle is complete, if the new comment control is visiible, set the focus to the box.
                    if (elem.is(':visible')) {

                    }
                });


            }
        },

        Family: {
            load: function () {

                $('#link_new_person').click(function (event) {
                    event.preventDefault();
                    var url = '/Family/NewPerson';
                    var data = 'createfamily=' + $('#createfamily').val();
                    $.ajax({
                        type: 'get',
                        url: url,
                        data: data,
                        beforeSend: function () {
                            // TODO: some kind of animation indicating call is being made
                        }, success: function (data, textStatus) {
                            $("#people").append(data);
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            //alert(errorThrown);
                        },
                        complete: function (XMLHttpRequest, textStatus) {
                            hideLoadingIndicator();
                        }
                    });
                });
            }
        },

        Address: {
            load: function () {
                $('.select_countries').each(function (index) {
                    $(this).change(function () {
                        // IF US is selected, show the States drop down list, else show the State/Province textbox
                        var idOfDropDown = $(this).attr("id");
                        var lastIndex = idOfDropDown.lastIndexOf(".");
                        // Find the prefix
                        var prefix = idOfDropDown.substr(0, lastIndex);
                        var idOfStates = '#' + prefix + '.stateid';
                        var idOfProvince = '#' + prefix + '.st_province';
                        // var selectedVal = $("#" + idOfDropDown + " :selected").val();
                        var selectedVal = $(this).val();
                        if (selectedVal == 225) {
                            $(idOfStates).show();
                            $(idOfProvince).hide();
                        } else {
                            $(idOfStates).hide();
                            $(idOfProvince).show();
                        }
                    });
                });
            }
        },

        MonthList: {

            load: function () {
                $('li.year').each(function (index) {
                    $(this).click(function (event) {
                        var ul = $(this).children('ul');
                        if (ul.hasClass('open')) {
                            ul.removeClass('open');
                        } else {
                            ul.addClass('open');
                        }
                    });
                });
            }
        },
        Schedule: {
            load: function () {
                //////////////////
                // schedule.js

                // Set up for initial value of the selected radio button
                if ($('#recurrence_weekly').is(':checked')) {
                    $('#recurrence_ends_wrapper').show();
                    $('#recurrence_weekly_wrapper').show();
                    $('#recurrence_monthly_wrapper').hide();
                    $('#recurrence_monthly_wrapper select, #recurrence_monthly_wrapper input').each(function (index) {
                        var el = $(this);
                        if (el.is('select') || el.is('input[type=text]')) {
                            el.val('');
                        } else if (el.is('checkbox')) {
                            el.attr('checked', true);
                        }
                    });
                } else if ($('#recurrence_monthly').is(':checked')) {
                    $('#recurrence_ends_wrapper').show();
                    $('#recurrence_monthly_wrapper').show();
                    $('#recurrence_weekly_wrapper').hide();
                    $('#recurrence_weekly_wrapper select, #recurrence_weekly_wrapper input').each(function (index) {
                        var el = $(this);
                        if (el.is('select') || el.is('input[type=text]')) {
                            el.val('');
                        } else if (el.is('checkbox')) {
                            el.attr('checked', false);
                        }
                    });

                    if ($('#recurrence_monthly_radio_nth').is(':checked')) {
                        $('#recurrence_monthly_date, #recurrence_monthly_date_month').each(function (index) {
                            var el = $(this);
                            el.attr('disabled', 'disabled');
                            el.val('');

                        });

                        $('#recurrence_monthly_nth, #recurrence_monthly_weekday, #recurrence_monthly_nth_month').each(function (el) {
                            var el = $(this);
                            el.removeAttr('disabled');
                        });
                    }
                } else if ($('#recurrence_never').is(':checked')) {
                    $('#end_temp_toggle').show();
                    $('#end_wrap_toggle').hide();
                    $('#end_toggle_date').attr('checked', false);
                    $('#end_date').val('');
                    $('#end_date').attr('disabled', 'disabled');
                    $('#recurrence_ends_wrapper').hide();
                    $('#recurrence_weekly_wrapper').hide();
                    $('#recurrence_monthly_wrapper').hide();
                    $('#recurrence_weekly_wrapper select, #recurrence_weekly_wrapper input, #recurrence_monthly_wrapper select, #recurrence_monthly_wrapper input').each(function (index) {
                        var el = $(this);
                        if (el.is('select') || el.is('input[type=text]')) {
                            el.val('');
                        } else if (el.is('checkbox')) {
                            el.attr('checked', false);
                        }
                    });
                }

                // Watch for changes to radio buttons [Monthly, weekly, one-time(never)]
                $('#recurrence_never, #recurrence_weekly, #recurrence_monthly').each(function (index) {
                    $(this).click(function (event) {
                        if (event.target.id === 'recurrence_weekly' && $(this).is(':checked')) {
                            $('#recurrence_ends_wrapper').show();
                            $('#recurrence_monthly_wrapper').hide();
                            $('#recurrence_weekly_wrapper').show();
                        }
                        else if (event.target.id === 'recurrence_monthly' && $(this).is(':checked')) {
                            $('#end_temp_toggle').show();
                            $('#end_wrap_toggle').hide();
                            $('#end_toggle_date').attr('checked', false);
                            $('end_date').val('');
                            $('end_date').attr('disabled', 'disabled');
                            $('#recurrence_ends_wrapper').show();
                            $('#recurrence_monthly_wrapper').show();
                            $('#recurrence_weekly_wrapper').hide();
                        } else if (event.target.id === 'recurrence_never' && $(this).is(':checked')) {
                            $('#end_temp_toggle').show();
                            $('#end_wrap_toggle').hide();
                            $('#end_toggle_date').attr('checked', false);
                            $('#end_date').val('');
                            $('#end_date').attr('disabled', 'disabled');
                            $('#recurrence_ends_wrapper').hide();
                            $('#recurrence_weekly_wrapper').hide();
                            $('#recurrence_monthly_wrapper').hide();
                        }

                        $('#recurrence_weekly_wrapper select, #recurrence_weekly_wrapper input, #recurrence_monthly_wrapper select, #recurrence_monthly_wrapper input').each(function (index) {
                            var el = $(this);
                            if (el.is('select') || el.is('input[type=text]')) {
                                el.val('');
                            } else if (el.is('checkbox')) {
                                el.attr('checked', false);
                            }
                        });
                    });
                });

                // For end time / date toggle. ("Stops Repeating" checkboxes and "End Time" checkboxes)
                // Are the checkboxes checked?
                $('input.end_toggle').each(function (index) {
                    var el = $(this);
                    if (el.is(':checked')) {
                        el.parent('td').next('td').children('div.end_temp').hide();
                        el.parent('td').next('td').children('div.end_wrap').show();
                        el.parent('td').next('td').children('input').disabled = false;
                    } else {
                        el.parent('td').next('td').children('div.end_temp').show();
                        el.parent('td').next('td').children('div.end_wrap').hide();
                        el.parent('td').next('td').children('input').value = '';
                        el.parent('td').next('td').children('input').disabled = true;
                    }
                });

                // Click event for checkboxes.("Stops Repeating" checkboxes and "End Time" checkboxes)
                $('input.end_toggle').each(function (index) {
                    var el = $(this);
                    el.click(function (event) {
                        if (el.is(':checked')) {
                            el.parent('td').next('td').children('div.end_temp').hide();
                            el.parent('td').next('td').children('div.end_wrap').show();
                            el.parent('td').next('td').children('input').disabled = false;
                            el.parent('td').next('td').children('input').focus();
                        } else {
                            el.parent('td').next('td').children('div.end_temp').show();
                            el.parent('td').next('td').children('div.end_wrap').hide();
                            el.parent('td').next('td').children('input').value = '';
                            el.parent('td').next('td').children('input').disabled = true;
                        }
                    });
                });

                // Calendrical jquery control for the time component
                $('#StartTime, #EndTime').calendricalTimeRange();

                // allow_date_only
                //                var dates = $$('input.allow_date_only');
                //                if (dates.length > 0) {
                //                    dates.each(function (dt) {
                //                        dt.observe('keypress', function (event) {
                //                            var keycode = Event.getKeyCode(event);
                //                            var code = event.charCode ? event.charCode : event.keyCode;
                //                            if (![8, 9, 37, 38, 39, 40, 47, 116].include(code)) {
                //                                if (code < 48 || code > 57) {
                //                                    Event.stop(event);
                //                                    return false;
                //                                }
                //                            }

                //                            if (code == 38) {
                //                                // Up arrow
                //                                if (dt.value.empty()) {
                //                                    dt.setValue(Date.today().add(1).days().toString(FT_is_international ? "dd/MM/yyyy" : "MM/dd/yyyy"));
                //                                }
                //                                else {
                //                                    var d = Date.parseExact(dt.value, FT_is_international ? "dd/MM/yyyy" : "MM/dd/yyyy");
                //                                    if (d) {
                //                                        dt.setValue(d.add(1).days().toString(FT_is_international ? "dd/MM/yyyy" : "MM/dd/yyyy"));
                //                                    }
                //                                    else {
                //                                        dt.value = '';
                //                                    }
                //                                }
                //                                Event.stop(event);
                //                                return false;
                //                            }
                //                            else if (code == 40) {
                //                                // Down arrow
                //                                if (dt.value.empty()) {
                //                                    dt.setValue(Date.today().add(-1).days().toString(FT_is_international ? "dd/MM/yyyy" : "MM/dd/yyyy"));
                //                                }
                //                                else {
                //                                    var d1 = Date.parseExact(dt.value, FT_is_international ? "dd/MM/yyyy" : "MM/dd/yyyy");
                //                                    if (d1) {
                //                                        dt.setValue(d1.add(-1).days().toString(FT_is_international ? "dd/MM/yyyy" : "MM/dd/yyyy"));
                //                                    }
                //                                    else {
                //                                        dt.value = '';
                //                                    }
                //                                }
                //                                Event.stop(event);
                //                                return false;
                //                            }
                //                            else if (code === 116) {
                //                                // T
                //                                dt.value = Date.today().toString(FT_is_international ? "dd/MM/yyyy" : "MM/dd/yyyy");
                //                                Event.stop(event);
                //                                return false;
                //                            }
                //                        });
                //                    });
                //                }
                // end allow_date_only
                //////////////////////
            }
        }
    }
    // Pass in jQuery.
})(jQuery);