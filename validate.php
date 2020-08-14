﻿<?php
$url = $_POST["url"];
$words = json_decode($_POST["words"]);
$wordsFound = false;
$wordToValidate = "";
$response = "";
$word = "";

for ($i = 0; $i < sizeof($words); $i++)
{
	$wordToValidate = $words[$i];
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);

	curl_setopt_array($curl, array(
	CURLOPT_URL => $url . $wordToValidate,
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "GET",
	CURLOPT_HTTPHEADER => array(
	"app_id: 958ab193",
	"app_key: 60d5994148ce1699defd2194dd9c25b9"
	),
	));

	$response = curl_exec($curl);

	$res = json_decode($response);

	if (array_key_exists("id", $res)) 
	{
		$wordsFound = true;
		$word = $res->id;
		break;
	}

	curl_close($curl);
}

$result = array("wordsFound" => $wordsFound, "word" => $word);
echo json_encode($result);
?>