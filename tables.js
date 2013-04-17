/**
 * file tables.js
 * author Mark Macdonald
 */

function dataTable(configs) {
 this.enabled = false;
 this.showIndex = configs.showIndex;
 this.queryCount = configs.rowsPerPage; 
 this.container = configs.container;
 this.queryFrom = 0;
 this.isEnd = false;
 this.searchQuery = "";
 this.url = "";
 var parent = this; //scope handle for inside methods

 //initiatalise and bind events
 $(this.container).on("click", "#dataTableSearch", function(){
	parent.queryFrom = 0; //must reset to first page when searching
	parent.searchQuery = $("#dataTableSearchInput").val();	
	parent.draw();
 });
 $(this.container).on('keydown', '#dataTableSearchInput', function(evt){
   if (evt.which == 13) { // return key
	parent.queryFrom = 0; //must reset to first page when searching
	parent.searchQuery = $("#dataTableSearchInput").val();	
	parent.draw();
   }
 });
 $(this.container).on("click", "#dataTableNext", function(){
	if(!parent.isEnd){
		parent.queryFrom = parent.queryFrom+parent.queryCount;
		parent.draw();
	}
 });
 $(this.container).on("click", "#dataTablePrevious", function(){
	if(parent.queryFrom != 0){
		parent.queryFrom = parent.queryFrom-parent.queryCount;
		parent.draw();
	}
 });

 //table draw method
 this.draw = function draw() {
 
	 if(this.enabled){
		 var query = 'data.json'/*+parent.queryFrom+'/'+parent.searchQuery*/;
		 $.get(/*getAjaxMethod()*/''+query,"", function(result){ //todo - only request maxRows
			if (result != null) {

				parent.queryFrom = result.meta.queryFrom;
				var matchCount = result.meta.matchCount;
				var finalVisibleRow = 0;

				//find the table dimensions
				var rowCount = result.rows.length;
				var columnCount = result.meta.headings.length;
				
				//create navigation controls (todo - separate styles)
				var html = new Array(), i = -1;
				html[++i] = '<div>';
				 html[++i] = '<div id="tableControls">';
				 html[++i] = '<input id="dataTableSearchInput" value="'+parent.searchQuery+'" type="text" />';
				 html[++i] = '<button id="dataTableSearch" type="button">Search</button>';
				 html[++i] = '<div id="dataTableMatchesLabel"><em id="rowCountDetails" style="margin-right:10px;"></em>';
				 html[++i] = '<button id="dataTablePrevious" type="button"><</button><button id="dataTableNext" type="button">></button></div>';
				 html[++i] = '</div>';
				html[++i] = '<table class="w-table w-fixed w-stripe" style="width:100%"></table>';
				html[++i] = '</div>';
				parent.container.html(html.join(''));
				
				//build headings
				var heading = new Array(), j = -1;
				heading[++j] = '<thead>';
				if(parent.showIndex) {
					heading[++j] = '<th>Index</th>';
				}
				for (var h=0; h<columnCount; ++h) {
					heading[++j] = '<th style="width:'+result.meta.headings[h].width+';">';
					heading[++j] = result.meta.headings[h].name;
					heading[++j] = '</th>';
				}
				heading[++j] = '</thead>';
				parent.container.find('table').append(heading.join(''));

				//build rows
				if(rowCount == 0){
					parent.container.find('table').append('<tr><td colspan="'+columnCount+'">No data was returned</td></tr>');
				}
				else{
					for (var row=0; row<result.rows.length; ++row) {
						var rowHTML = new Array(), j = -1;
						rowHTML[++j] = '<tr>';
						if(parent.showIndex) {
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

						parent.container.find('table').append(rowHTML.join(''));
					
						//post processing of rows
						var firstCell = parent.container.find('tr').eq(row+1).find('td:first-child');
						var lastCell = parent.container.find('tr').eq(row+1).find('td:last-child');
						var allCells = parent.container.find('tr').eq(row+1).find('td');
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
						var user_id = lastCell.text();
						lastCell.html('<span class="falseLink edit" id="'+user_id+'">Edit</span>');
						
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
					var displayFrom = parent.queryFrom+1;
					var displayTo = parent.queryFrom+finalVisibleRow;
					$('#rowCountDetails').html('showing '+displayFrom+' to '+displayTo+' of '+matchCount+' matches');
				}
				//has the end of the data been reached?
				if(displayTo >= matchCount){
					parent.isEnd = true;
				}
				else {
					parent.isEnd = false;
				}

			}
		  }, "json");
	 }

 };
 
};
