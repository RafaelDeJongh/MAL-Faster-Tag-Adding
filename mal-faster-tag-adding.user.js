// MAL Faster Tag Adding
// Rafaël De Jongh
// Copyright (c) 2016
// This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// https://creativecommons.org/licenses/by-nc-sa/4.0/
//
// --------------------------------------------------
//
// ==UserScript==
// @version       1.2
// @editdate      31/10/2018
// @author        Rafaël De Jongh
// @namespace     https://www.RafaelDeJongh.com
// @contributor   Yogensia @ https://www.yogensia.com
// @name          My Anime List (MAL) - Faster Tag Adding
// @require       https://code.jquery.com/jquery-3.1.1.min.js
// @include       *://myanimelist.net/ownlist/*
// @include       *://myanimelist.net/editlist.php?*
// @include       *://myanimelist.net/panel.php?*
// @description   This script adds the option to create commonly used tags that can be inserted in the tag field when editing an entry on My Anime List.
// ==/UserScript==
//
/*Table of content:
--------------------------------------------------
- Global Variables
- Style Overwrites
- Tag Loop & Options
- Add Tags
- Remove Tags
- Show/Hide Checkbox

Global Variables
--------------------------------------------------*/
var saved = localStorage.getItem('tagArray');
var tags = 'textarea[name*="[tags]"]';
var txtval = $(tags).val();
var savedArray = localStorage.getItem('tagArray');
var tagArray = (localStorage.getItem('tagArray')!==null) ? JSON.parse(savedArray) : [];
localStorage.setItem('tagArray', JSON.stringify(tagArray));
/*Style Overwrites
--------------------------------------------------*/
$('<style type=\"text/css\">input,textarea,select,button{outline:none}textarea{width:350px;height:80px;max-width:450px}button::-moz-focus-inner{padding:0;border:0}#ftcheck{vertical-align:middle}#fastTagAdding{width:356px;margin-top:6px;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}#fastTagAdding a{cursor:pointer}.fTags{display:inline-block}#fastTagAdding span{margin-right:6px;display:inline-block}#fTag{margin-right:3px!important}#tagOptions{border-top:solid 1px #bebebe;margin-top:6px;padding-top:6px;min-height:21px}#tagAdd{margin-right:10px}#tagRemove{margin-left:10px}#addNewTags{display:inline;margin-right:10px}input[name="tagAddI"]{width:50%;outline:none;padding-left:3px}#tagAddB{padding:3px}.disabled{color:#333!important;text-decoration:line-through!important;cursor:not-allowed!important}</style>').appendTo("head");
/*Tag Loop & Options
--------------------------------------------------*/
$('<div id="fastTagAdding">').html('<span id="fTag">Tags: </span>').insertAfter(tags);
$.each(tagArray, function(i){$("#fastTagAdding").append('<span class="fTags"><a>' + tagArray[i] + '</a>,</span>');});
$("#fastTagAdding").append('<div id="tagOptions"><a id="tagAdd">Add Custom Tag</a> | <a id="tagRemove">Remove Last Tag</a></div>');
/*Click Functions
--------------------------------------------------*/
$(document).on("click",".fTags a",function(){
	if(!$(this).hasClass("disabled")){
		var txt = $.trim($(this).text());
		var txtbox = $(tags);
		var txtval = txtbox.val();
		if(txtval.slice(-2) === ", " || txtval.slice(-2) === ""){
			txtbox.val(txtval + txt);
		}else if(txtval.slice(-1) === ","){
			txtbox.val(txtval + " " + txt);
		}else{
			txtbox.val(txtval + ", " + txt);
		}
		$(this).closest("span").children("a").addClass("disabled");
	}
});
$.each(tagArray, function(i){
	if (txtval.indexOf(tagArray[i]) > -1) {
		$(".fTags a").each(function(){
			if($(this).text() == tagArray[i]){
				$(this).addClass("disabled");
			}
		});
	}
});
/*Add Tags
--------------------------------------------------*/
$("#tagAdd").on("click",function(){
	$(this).hide().after('<div id="addNewTags"><input type="text" name="tagAddI"placeholder="Insert a new tag" autofocus><button id="tagAddB" class="inputButton">Add</button></div>');
	$('input[name="tagAddI"]').focus();
	$("#tagAddB").on("click", function (e) {
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
$("#tagRemove").on("click", function(){
	tagArray.splice(-1, 1);
	$(".fTags").last().remove();
	localStorage.setItem('tagArray', JSON.stringify(tagArray));
});
/*Show/Hide Checkbox
--------------------------------------------------*/
if($('#add_anime_rewatch_value,#add_manga_reread_value').val() == 0){$('#add_anime_rewatch_value,#add_manga_reread_value').val(1);}
$('.advanced td').first().text("Fast Tags").append('<input id="ftcheck" type="checkbox" title="Show/Hide Fast Tags" name="ftcheck">');
var checkboxChecker = localStorage.getItem("ftcheck");
if (checkboxChecker !== null){$("#ftcheck").attr("checked","checked");}
if($("#ftcheck").is(':checked')){$('#fastTagAdding').show();}else{$('#fastTagAdding').hide();}
$('#ftcheck').on("click", function(){
	if($(this).is(':checked')){
		$('#fastTagAdding').slideDown();
		localStorage.setItem("ftcheck", $(this).val());
	}else{
		$('#fastTagAdding').slideUp();
		localStorage.removeItem("ftcheck");
	}
});
/*Other Adjustements
--------------------------------------------------*/
$("#add_anime_num_watched_times,#add_manga_num_read_times").attr("type",'number');
