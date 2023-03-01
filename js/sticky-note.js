$(document).ready(function(){

    if(localStorage.getItem("note_data") != null){
        ShowUserData();    
   }

    $(document).on("click","#OpenNoteAddModal",OpenNoteAddModal);
    $(document).on("click","#closeModal",CloseNoteModal);

    //add note
    $(document).on("click","#btnSaveNote",function(){
        var noteTitle = $("#noteTitle").val();
        var noteText = $("#noteText").val();
        var noteColor = $("#noteColor").val();
        if(IsValidNoteInput())
        {
            var noteId;
            var noteJson;
            if(localStorage.getItem("note_data") == null || JSON.parse(localStorage.getItem("note_data")).notes.length == 0)
            {
                var notes = [];
                noteId = 1;

                notes.push(         
                {
                    "id":noteId,
                    "noteTitle":noteTitle,
                    "noteText":noteText,
                    "noteColor":noteColor
                }
                );
                noteJson ={
                    "notes" : notes
                }
            }
            else
            {
                noteJson = JSON.parse(localStorage.getItem("note_data"));
                var lastIndexOfArray = noteJson.notes.length-1;
                noteId = Number(noteJson.notes[lastIndexOfArray].id) + 1;
                noteJson.notes.push({"id":noteId,
                "noteTitle":noteTitle,
                "noteText":noteText,
                "noteColor":noteColor
            });
            }
    
            localStorage.setItem("note_data", JSON.stringify(noteJson));
            
            ShowUserData();
            ClearNoteMSModal();
        }
    });
    
    //delete note
    $(document).on("click",".btn-note-delete",function(){
        if (confirm("Are you sure! want to delete?") == true) 
        {
            var noteId = $(this).attr('data-noteId');
            var indexNumber;
            var noteJson = JSON.parse(localStorage.getItem("note_data"));
            for(var i = 0 ;i < noteJson.notes.length; i++)
            {
                if(noteJson.notes[i].id == noteId)
                {
                    indexNumber = i;
                    break;
                }
            }
            noteJson.notes.splice(indexNumber, 1);
            localStorage.setItem("note_data", JSON.stringify(noteJson));
            ShowUserData();
        } 
    });

    //edit note
    $(document).on("click",".btn-note-edit",function(){
       
        $("#modalHeading").html("Edit Note");
        $("#noteAddModal").fadeIn();
        var noteId = $(this).attr('data-noteId');
        var indexNumber;
        var noteJson = JSON.parse(localStorage.getItem("note_data"));
        for(var i = 0 ;i < noteJson.notes.length; i++)
        {
            if(noteJson.notes[i].id == noteId)
            {
                indexNumber = i;
                break;
            }
        }
        $("#noteTitle").val(noteJson.notes[indexNumber].noteTitle);
        $("#noteText").val(noteJson.notes[indexNumber].noteText);
        $("#noteId").html(noteJson.notes[indexNumber].id);
        $("#noteColor").val(noteJson.notes[indexNumber].noteColor);

        $("#btnSaveNote").hide();  
        $("#btnUpdateNote").show();

    });
    
    //update note
    $(document).on("click","#btnUpdateNote",function(){
        
        if(IsValidNoteInput())
        {
            if (confirm("Are your sure! want to update?") == true) 
            {
                var noteId = Number($("#noteId").text());
                var indexNumber;
                var noteJson = JSON.parse(localStorage.getItem("note_data"));
                for(var i = 0 ;i < noteJson.notes.length; i++)
                {
                    console.log(noteId);
                    if(Number(noteJson.notes[i].id) == noteId)
                    {
                        indexNumber = i;
                        break;
                    }
                }
                
                noteJson.notes[indexNumber].noteTitle = $("#noteTitle").val();
                noteJson.notes[indexNumber].noteText = $("#noteText").val();
                noteJson.notes[indexNumber].noteColor = $("#noteColor").val();

                localStorage.setItem("note_data", JSON.stringify(noteJson));
                
                ShowUserData();
                CloseNoteModal();
            } 
            else 
            {
                CloseNoteModal();
            }
        }
    }); 

});



function OpenNoteAddModal(){
    $("#modalHeading").html("Add Note");
    $("#noteAddModal").fadeIn();
    $("#btnSaveNote").show();  
    $("#btnUpdateNote").hide();
}

function CloseNoteModal()
{
    $("#noteAddModal").fadeOut();
    ClearNoteMSModal();
}

function ClearNoteMSModal(){
    $("#noteTitle").val("");
    $("#noteText").val("");
    $("#noteId").html("");
    _cmnRemoveAllErrorMessage();
}

function ShowUserData(){
    var noteJson = JSON.parse(localStorage.getItem("note_data"));
    var totalNote = noteJson.notes.length;
    var stickyNoteAllItems = "";
    
    if(localStorage.getItem("note_data") != null)
    {            
        for(var i = 0; i < totalNote; i++)
        {
            stickyNoteAllItems += 
            `<div class="note-item" style="background: ${noteJson.notes[i].noteColor};">
                <button data-noteId = "${noteJson.notes[i].id}" class="btn btn-note-delete"><i class="fa-solid fa-trash-can"></i></button>
                <button data-noteId = "${noteJson.notes[i].id}" class="btn btn-note-edit"><i class="fa-solid fa-pen-to-square"></i></button>
                <div><h3 class="noteTitle">${noteJson.notes[i].noteTitle}</h3></div>
                <div class="mote-title-underline"></div>
                <div class="note-body">
                    ${noteJson.notes[i].noteText}
                </div>
            </div>`;
        }
        
        $("#allStickyNotes").html(stickyNoteAllItems);

        if($("#allStickyNotes").text() == "")
        {
            $("#localStorageEmptyMessage").show(); 
        }
        else{
            $("#localStorageEmptyMessage").hide(); 
        }
    }   
}

function IsValidNoteInput(){

    _cmnRemoveAllErrorMessage();

    var noteTitle = $("#noteTitle").val();
    var noteText = $("#noteText").val();

    if(noteTitle == "")
    {
        _cmnShowErrorMessageBottomOfTheInputFiled("noteTitle","Feild can not be empty.");
        return false;
    }
    else if(!_cmnisLengthValid(noteTitle, 3, 60))
    {
        _cmnShowErrorMessageBottomOfTheInputFiled("noteTitle","Title length must be 3 to 60 Charecter.");
    }

    if(noteText == "")
    {
        _cmnShowErrorMessageBottomOfTheInputFiled("noteText","Feild can not be empty.");
        return false;
    }
    
    return true;
}