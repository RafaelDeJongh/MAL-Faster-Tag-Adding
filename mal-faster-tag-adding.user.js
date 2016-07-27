// MAL Faster Tag Adding
// 27/07/2016
// Rafaël De Jongh
// Copyright (c) 2016
// This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// https://creativecommons.org/licenses/by-nc-sa/4.0/
//
// --------------------------------------------------
//
// ==UserScript==
// @version		1.0
// @author		Rafaël De Jongh
// @namespace	http://www.rafaeldejongh.com
// @name		My Anime List (MAL) - Faster Tag Adding
// @include		http://myanimelist.net/ownlist/*
// @include		http://myanimelist.net/animelist/*
// @include		http://myanimelist.net/editlist.php?*
// @include		http://myanimelist.net/panel.php?*
// @description	This script adds the option to create commonly used tags that can be inserted in the tag field when editing an entry on My Anime List.
// ==/UserScript==
//
/*Table of content:
--------------------------------------------------
- Global Variables
- Style Overwrites
- Tag Loop & Options
- Add Tags
- Remove Tags

Global Variables
--------------------------------------------------*/
var saved = localStorage.getItem('tagArray');
var tags = 'textarea[name*="[tags]"]';
var savedArray = localStorage.getItem('tagArray');
var tagArray = (localStorage.getItem('tagArray')!==null) ? JSON.parse(savedArray) : [];
localStorage.setItem('tagArray', JSON.stringify(tagArray));
/*Style Overwrites
--------------------------------------------------*/
$('<style type=\"text/css\">input,textarea,select,button{outline:none}textarea{width:350px;height:80px;max-width:450px}#fastTagAdding{width:356px;margin-top:6px}#fastTagAdding a{cursor:pointer}.fTags{display:inline-block}#fastTagAdding span{margin-right:6px;display:inline-block;}#fTag{margin-right:3px!important}#tagOptions{border-top:solid 1px #bebebe;margin-top:6px;padding-top:6px;min-height:21px}#tagAdd{margin-right:10px}#tagRemove{margin-left:10px}#addNewTags{display:inline}input[name="tagAddI"]{width:50%;outline:none;padding-left:3px}#tagAddB{padding:3px}</style>').appendTo("head");
/*Tag Loop & Options
--------------------------------------------------*/
$('<div id="fastTagAdding">').html('<span id="fTag">Tags: </span>').insertAfter(tags);
$.each(tagArray, function(i){$("#fastTagAdding").append('<span class="fTags"><a>' + tagArray[i] + '</a>,</span>');});
$("#fastTagAdding").append('<div id="tagOptions"><a id="tagAdd">Add Custom Tag</a> | <a id="tagRemove">Remove Last Tag</a></div>');
/*Click Functions
--------------------------------------------------*/
$(".fTags").live("click", "a.fTags", function() {
	var txt = $.trim($(this).text());
	var txtbox = $(tags);
	if(txtbox.val().slice(-2) === ", " || txtbox.val().slice(-2) === ""){
		txtbox.val(txtbox.val() + txt + " ");
	}else{
		txtbox.val(txtbox.val() + ", " + txt + " ");
	}
});
/*Add Tags
--------------------------------------------------*/
$("#tagAdd").click(function(){
	$(this).hide().after('<div id="addNewTags"><input type="text" name="tagAddI"placeholder="Insert a new tag" autofocus><button id="tagAddB" class="inputButton">Add</button></div>');
	$('input[name="tagAddI"]').focus();
	$("#tagAddB").click(function (e) {
		e.preventDefault();
		var newTag = $.trim($('input[name="tagAddI"]').val().replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, ""));
		var tags = newTag.substr(0, 1).toUpperCase() + newTag.substr(1);
		if(newTag !== ""){
			tagArray.push(tags);
			$("#tagOptions").before('<span class="fTags"><a>' + tagArray[tagArray.length-1] + '</a>,</span>');
			$("#addNewTags").remove();
			$("#tagAdd").show();
			localStorage.setItem('tagArray', JSON.stringify(tagArray));
		}
	});
	$('input[name="tagAddI"]').focusout(function(){
		if($(this).val() === ""){
			$("#addNewTags").remove();
			$("#tagAdd").show();
		}
	});
});
/*Remove Tags
--------------------------------------------------*/
$("#tagRemove").live("click", function(){
	tagArray.splice(-1, 1);
	$(".fTags").last().remove();
	localStorage.setItem('tagArray', JSON.stringify(tagArray));
});
