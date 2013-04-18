/**
 * file tables.js
 * author Mark Macdonald
 */

(function( $ ){

	var search = function() {
		var $this = $(this);
		$this.queryFrom = 0; //must reset to first page when searching
		$this.searchQuery = $("#dataTableSearchInput").val();
		methods['draw'].apply();
	}

	var searchKeyDown = function(evt) {
		var $this = $(this);
		if (evt.which == 13) { // return key
			$this.queryFrom = 0; //must reset to first page when searching
			$this.searchQuery = $("#dataTableSearchInput").val();	
			methods['draw'].apply();
		}
	}

	var next = function() {
		var $this = $(this);
		if(!$this.isEnd){
			$this.queryFrom = $this.queryFrom+$this.queryCount;
			methods['draw'].apply();
		}
	}

	var previous = function() {
		var $this = $(this);
		if($this.queryFrom != 0){
			$this.queryFrom = $this.queryFrom-$this.queryCount;
			methods['draw'].apply();
		}
	}

  var methods = {
    init : function( options ) {
		var $this = $(this);
		var settings = $this.data('table'); //fetch existing settings (undefined if none are saved)
		if(typeof(settings) == 'undefined') { //merge defaults and passed options if none are saved
			var defaults = {
				enabled : true,
				showIndex : false,
				queryCount : 0, 
				queryFrom : 0,
				isEnd : false,
				searchQuery : '',
				url : 'data.json'
			}
			settings = $.extend({}, defaults, options);
			$this.data('table', settings);
		}
		else { //merge saved settings and passed options
			settings = $.extend({}, settings, options);
			$this.data('table', settings);
		}
		

    },

	destroy: function() {
		var $this = $(this);
		$this.removeData('table');
	},
	
    draw : function( ) {
		var $this = $(this);
		var settings = $this.data('table');
		//alert(settings.searchQuery);
		
		if(settings.enabled) {
			$.get(settings.url,"", function(result){ 
			if (result != null) {

				settings.queryFrom = result.meta.queryFrom;
				var matchCount = result.meta.matchCount;
				var finalVisibleRow = 0;

				//find the table dimensions
				var rowCount = result.rows.length;
				var columnCount = result.meta.headings.length;
				
				//create navigation controls (todo - separate styles)
				var html = new Array(), i = -1;
				html[++i] = '<div>';
				 html[++i] = '<div id="tableControls">';
				 html[++i] = '<input id="dataTableSearchInput" value="'+settings.searchQuery+'" type="text" />';
				 html[++i] = '<button id="dataTableSearch" type="button">Search</button>';
				 html[++i] = '<div id="dataTableMatchesLabel"><em id="rowCountDetails" style="margin-right:10px;"></em>';
				 html[++i] = '<button id="dataTablePrevious" type="button"><</button><button id="dataTableNext" type="button">></button></div>';
				 html[++i] = '</div>';
				html[++i] = '<table class="w-table w-fixed w-stripe" style="width:100%"></table>';
				html[++i] = '</div>';
				$this.html(html.join(''));
				
				//build headings
				var heading = new Array(), j = -1;
				heading[++j] = '<thead>';
				if(settings.showIndex) {
					heading[++j] = '<th>Index</th>';
				}
				for (var h=0; h<columnCount; ++h) {
					heading[++j] = '<th style="width:'+result.meta.headings[h].width+';">';
					heading[++j] = result.meta.headings[h].name;
					heading[++j] = '</th>';
				}
				heading[++j] = '</thead>';
				$this.find('table').append(heading.join(''));

				//build rows
				if(rowCount == 0){
					$this.find('table').append('<tr><td colspan="'+columnCount+'">No data was returned</td></tr>');
				}
				else{
					for (var row=0; row<result.rows.length; ++row) {
						var rowHTML = new Array(), j = -1;
						rowHTML[++j] = '<tr>';
						if(settings.showIndex) {
							rowHTML[++j] = '<td>'+(row+1)+'</td>';
						}
						for (var cell=0; cell<columnCount; ++cell) {
							if(result.rows[row].data[cell].meta.editable) {
								rowHTML[++j] = '<td id="'+result.rows[row].data[cell].meta.path+'">';
								if(result.rows[row].data[cell].meta.type == "text") {
									rowHTML[++j] = '<input type="text" class="dataTable-text" value="'+result.rows[row].data[cell].value+'">';		
								}
								else if(result.rows[row].data[cell].meta.type == "checkbox") {
									if(result.rows[row].data[cell].value == true) {
										rowHTML[++j] = '<input type="checkbox" class="dataTable-bool" checked="checked">';						
									}
									if(result.rows[row].data[cell].value == false){
										rowHTML[++j] = '<input type="checkbox" class="dataTable-bool">';								
									}
								}
								else if(result.rows[row].data[cell].meta.type == "select")
								{
									rowHTML[++j] = '<select class="dataTable-select">';						
									for( var enums = 0; enums < result.rows[row].data[cell].meta.choices.length; ++enums) {
										if(result.rows[row].data[cell].value == result.rows[row].data[cell].meta.choices[enums]) {
											rowHTML[++j] = '<option selected="selected">'+result.rows[row].data[cell].meta.choices[enums]+'</option>'
										}
										else {
											rowHTML[++j] = '<option>'+result.rows[row].data[cell].meta.choices[enums]+'</option>'							
										}
									}
									rowHTML[++j] = '</select>';	
								}
							}
							else {
								rowHTML[++j] = '<td>';
								rowHTML[++j] = result.rows[row].data[cell].value;
							}
							rowHTML[++j] = '</td>';						
						}	
						rowHTML[++j] = '</tr>';

						$this.find('table').append(rowHTML.join(''));
					
						//post processing of rows
						var firstCell = $this.find('tr').eq(row+1).find('td:first-child');
						var lastCell = $this.find('tr').eq(row+1).find('td:last-child');
						var allCells = $this.find('tr').eq(row+1).find('td');
						var defaultIndentation = 15; //matches framework
						var extraIndentation = 0; //to allow for arrow
						if(result.rows[row].meta.arrow == true) {
							firstCell.css("background-image","url('style/arrow.png')");
							firstCell.css("background-repeat","no-repeat");			
							firstCell.css("background-position",(defaultIndentation+(result.rows[row].meta.indentation*10)+"px center"));
							extraIndentation = 10;
						}
						if(result.rows[row].meta.style == "bold") {
							allCells.css("font-weight","bold");
						}
					
						//indentation
						var indentation = defaultIndentation+extraIndentation+(result.rows[row].meta.indentation*10)+'px';
						firstCell.css("padding-left",indentation);

						//status coloring
						if( result.rows[row].meta.status == "bad") {
							allCells.css("background-color","#fbadad");
						}
						else if ( result.rows[row].meta.status == "ok") {
							allCells.css("background-color","#d0f8b6");
						}

						//post processing of rows to add edit links
						//var user_id = lastCell.text();
						//lastCell.html('<span class="falseLink edit" id="'+user_id+'">Edit</span>');
						
						//alarm view post processing of rows
						//if(selectedProtobufType == "caf.alarm.Point"){
						//	if ( result.rows[row].data[2].value == "ACKNOWLEDGED" ) {
						//		allCells.css("color","#b22e2e");
						//	}
						//	else if ( result.rows[row].data[2].value == "CLEARED" ) {
						//		allCells.css("color","#385691");
						//	}
						//	else if ( result.rows[row].data[2].value == "UNACKNOWLEDGED" ) {
						//		allCells.css("color","white");
						//		allCells.css("background-color","#b22e2e");
						//	}

						//	lastCell.html(""); //don't display anything in last column unless showing acknowledge button
						//	if(result.rows[row].data[2].value == "CLEARED" || result.rows[row].data[2].value == "UNACKNOWLEDGED" ){
						//		lastCell.append('<button class="small acknowledge" type="button">Acknowledge</button>');
						//	}
						//}
					
						finalVisibleRow++;
					}

					//append match count information
					var displayFrom = settings.queryFrom+1;
					var displayTo = settings.queryFrom+finalVisibleRow;
					$('#rowCountDetails').html('showing '+displayFrom+' to '+displayTo+' of '+matchCount+' rows');
				}
				//has the end of the data been reached?
				if(displayTo >= matchCount){
					settings.isEnd = true;
				}
				else {
					settings.isEnd = false;
				}			

		//bind event handlers	
		$this.find('#dataTableSearch').click(search);
		$this.find('#dataTableSearchInput').keydown(searchKeyDown);
		$this.find('#dataTableNext').click(next);
		$this.find('#dataTablePrevious').click(previous);
		
			}
		  }, "json");
		}
    }

  };

  $.fn.table = function( method ) {

    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.table' );
    }    

  };

})( jQuery );
 
