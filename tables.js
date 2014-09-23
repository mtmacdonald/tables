/*! Tables.js (c) 2014 Mark Macdonald | http://mtmacdonald.github.io/tables/LICENSE */

(function( $ ){

	var search = function() {
		var $this = $(this).closest('.w-datatable').parent();
		var settings = $this.data('table');
		var searchQuery = $(this).prev('input').val();
		var new_settings = {
			'queryFrom' : 0, //must reset to first page when searching
			'searchQuery' : searchQuery,
		}
		settings = $.extend({}, settings, new_settings);
		$this.data('table', settings);
		methods.draw.apply( $this, new_settings );
	}

	var searchKeyDown = function(evt) {
		if (evt.which == 13) { // return key
			var $this = $(this).closest('.w-datatable').parent();
			var settings = $this.data('table');
			var searchQuery = $(this).val();
			var new_settings = {
				'queryFrom' : 0, //must reset to first page when searching
				'searchQuery' : searchQuery,
			}
			settings = $.extend({}, settings, new_settings);
			$this.data('table', settings);
			methods.draw.apply( $this, new_settings );
		}	
	}

	var next = function() {
		var $this = $(this).closest('.w-datatable').parent();
		var settings = $this.data('table');
		if(!settings.isEnd) {
			var queryFrom = settings.queryFrom+settings.queryCount;
			var new_settings = {
				'queryFrom' : queryFrom,
			}
			settings = $.extend({}, settings, new_settings);
			$this.data('table', settings);
			methods.draw.apply( $this, new_settings );
		}
	}

	var previous = function() {
		var $this = $(this).closest('.w-datatable').parent();
		var settings = $this.data('table');
		if(settings.queryFrom != 0) {
			var queryFrom = settings.queryFrom-settings.queryCount;
			var new_settings = {
				'queryFrom' : queryFrom,
			}
			settings = $.extend({}, settings, new_settings);
			$this.data('table', settings);
			methods.draw.apply( $this, new_settings );
		}
	}

	var methods = {

		init : function( options ) {
			var $this = $(this);
			var settings = $this.data('table'); //fetch existing settings (undefined if none are saved)
			if(typeof(settings) == 'undefined') { //merge defaults and passed options if none are saved
				var defaults = {
					'row' : null, //either pass in row data (JSON) or use the url setting instead
					'url' : 'test.php', //the url from which to fetch the table data (JSON format)
					'queryCount' : 2, //how many rows to show per page (should match the server-side settings)
					'enabled' : true, //table('draw') only operates when enabled is true
					'showIndex' : false, //display an optional column showing the row index
					'queryFrom' : 0, //internal use only - which row to request data from (for pagination)
					'searchQuery' : '', //internal use only - stores the search query
					'isEnd' : false //internal use only - whether the end of the data has been reached 
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

		render : function() {
			var $this = $(this);
			var settings = $this.data('table');
			var result = settings.rows;

			settings.queryFrom = result.meta.queryFrom;
			var matchCount = result.meta.matchCount;
			var finalVisibleRow = 0;

			//find the table dimensions
			var rowCount = result.rows.length;
			var columnCount = result.meta.headings.length;

			//create navigation controls
			var html = new Array(), i = -1;
			html[++i] = '<div class="w-datatable">';
				html[++i] = '<div id="tableControls">';
				html[++i] = '<input id="dataTableSearchInput" value="'+settings.searchQuery+'" type="text" />';
				html[++i] = '<button id="dataTableSearch" type="button">Search</button>';
				html[++i] = '<div id="dataTableMatchesLabel"><em id="rowCountDetails"></em>';
				html[++i] = '<button id="dataTablePrevious" type="button"><</button><button id="dataTableNext" type="button">></button></div>';
				html[++i] = '</div>';
			html[++i] = '<table class="w-table w-fixed w-stripe"></table>';
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

			//event handlers	
			$this.find('#dataTableSearch').click(search);
			$this.find('#dataTableSearchInput').keydown(searchKeyDown);
			$this.find('#dataTableNext').click(next);
			$this.find('#dataTablePrevious').click(previous);
		},

		draw : function( ) {
			var $this = $(this);
			var settings = $this.data('table');
			if(settings.enabled) {
				var params = { queryFrom: settings.queryFrom, searchQuery: settings.searchQuery };
				$.getJSON(settings.url, params, function(result) {
					if (result != null) {
						settings.rows = result;
						methods.render.apply( $this, settings );
					}
				});
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
 
