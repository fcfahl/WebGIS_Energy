function html_Design (LULC_layers) {

    // Uncheck the checkboxes (problem in Firefox)
    $('input:checkbox').removeAttr('checked');

    // Accordeon - expand layer panels
    $( "#accordion" )
        .accordion({
        header: "> div > h3",
        heightStyle: "content",
        collapsible: true,
        active: 2,
        icons: { "header": "ui-icon-plus", "activeHeader": "ui-icon-minus" },
    })
    .sortable({
        axis: "y",
        handle: "h3",
        stop: function( event, ui ) {
            // IE doesn't register the blur when sorting
            // so trigger focusout handlers to remove .ui-state-focus
            ui.item.children( "h3" ).triggerHandler( "focusout" );

            // Refresh accordion to handle new order
            $( this ).accordion( "refresh" );
        }
    });

    // Display Legend and metadata
    $(".boxlayer").change(function() {

        var value = $(this).attr("value");
        var index = $(this).attr("rel");

        var leg = "#leg_" + value;
        var tbl = "#tbl_" + value;

        if(this.checked) {
            $(leg).show();
            $(tbl).show();
            //  console.log( leg );
        }else{
            $(leg).hide();
            $(tbl).hide();
            // console.log( tbl );
        }
    });

    function sortPannel() {

        var $legCache = $('#legend');
        var $tblCache = $('#tables');

        $legCache.find('.leg').sort(function (a, b) {
            return +a.getAttribute('rel') - +b.getAttribute('rel');
        }).appendTo($legCache);

        $tblCache.find('.tbl').sort(function (a, b) {
            return +a.getAttribute('rel') - +b.getAttribute('rel');
        }).appendTo($tblCache);
    }

    // Drag and Drop layers
    $( "#lulc").sortable({

        update: function (e, ui) {

            console.clear();
            $("#lulc div").each(function (i, elm) {

                var name = ($(this).attr('id')),
                index = i,
                ID_leg = ("#leg_" + name),
                ID_table = ("#tbl_" + name),
                ID_opacity = ("#opy_" + name),
                index_ID = (100 - index);

                // update Json object
                window[name].options.zIndex = index_ID;
                window[name].wmsParams.zIndex = index_ID;

                console.log(window[name].wmsParams.layers, " : ",  window[name].wmsParams.zIndex);

                window[name].setZIndex(index_ID);

                // Let ADM always on top
                window["NUTS0"].setZIndex(500);

                //  console.log("index: " +  index);
                //  console.log("ID_leg: " + ID_leg);

                // Redefine rel value based on the new div sequence
                $(ID_leg).attr('rel', index);
                $(ID_table).attr('rel', index);

                var test =$(ID_leg).attr('rel');
                // console.clear()
                // console.log(ID_leg + ": rel: " + test);

                sortPannel();
            });
        }
    });



}
