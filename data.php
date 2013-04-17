<?

$result = FALSE;

$headings = array(
	(object)array("name" => "Name", "width" => "20%"),
	(object)array("name" => "Company", "width" => "20%"),
	(object)array("name" => "Email", "width" => "20%"),
	(object)array("name" => "Role", "width" => "20%"),
	(object)array("name" => "Status", "width" => "20%"),
);

$matchCount = 25;
$offset = 0;
$row_meta = (object)array("indentation" => 0);
$data = array();
$cell_meta = (object)array();

$rows = array();

array_push($data, (object)array("meta" => $cell_meta, "value" => "monkey") );
array_push($data, (object)array("meta" => $cell_meta, "value" => "monkey") );
array_push($data, (object)array("meta" => $cell_meta, "value" => "monkey") );
array_push($data, (object)array("meta" => $cell_meta, "value" => "monkey") );
array_push($data, (object)array("meta" => $cell_meta, "value" => "monkey") );

array_push($rows, (object)array("meta" => $row_meta, "data" => $data) );


$queryFrom = (int)$offset;
$table_meta = (object)array("queryFrom" => $queryFrom, "matchCount" => $matchCount, "headings" => $headings);
$result = (object)array("rows" => $rows, "meta" => $table_meta);

echo json_encode($result);