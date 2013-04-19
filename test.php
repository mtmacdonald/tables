<?

$searchQuery = null;
$queryFrom = null;

if($_GET && $_GET["searchQuery"]) $searchQuery = $_GET["searchQuery"];
if($_GET && $_GET["queryFrom"]) $searchQuery = $_GET["queryFrom"];

$result = FALSE;

$headings = array(
	(object)array("name" => "Name", "width" => "50%"),
	(object)array("name" => "Country", "width" => "50%"),
);

$matchCount = 4;
$offset = 0;
$row_meta = (object)array("indentation" => 0);

$cell_meta = (object)array();

$rows = array();

$data = array();
array_push($data, (object)array("meta" => $cell_meta, "value" => "Kristian") );
array_push($data, (object)array("meta" => $cell_meta, "value" => "Norway") );
array_push($rows, (object)array("meta" => $row_meta, "data" => $data) );

$data = array();
array_push($data, (object)array("meta" => $cell_meta, "value" => "Dave") );
array_push($data, (object)array("meta" => $cell_meta, "value" => "UK") );
array_push($rows, (object)array("meta" => $row_meta, "data" => $data) );

$data = array();
array_push($data, (object)array("meta" => $cell_meta, "value" => "Emilie") );
array_push($data, (object)array("meta" => $cell_meta, "value" => "France") );
array_push($rows, (object)array("meta" => $row_meta, "data" => $data) );

$data = array();
array_push($data, (object)array("meta" => $cell_meta, "value" => "Javier") );
array_push($data, (object)array("meta" => $cell_meta, "value" => "Spain") );
array_push($rows, (object)array("meta" => $row_meta, "data" => $data) );

$queryFrom = (int)$offset;
$table_meta = (object)array("queryFrom" => $queryFrom, "matchCount" => $matchCount, "headings" => $headings);
$result = (object)array("rows" => $rows, "meta" => $table_meta);

echo json_encode($result);