function clearMsg(id)
{
   setTimeout(function(){$(id).html("");}, 5000);
}



//==CRUD===============================================================================================
function FormNGridCRUD(options)
{
   var dComBus = options.dComBus || "";
   var CRUDModule = options.CRUDModule || "";
   var CRUDForm = options.CRUDForm || "";
   var CRUDFormDivMsg = options.CRUDFormDivMsg || "";
   
   var CRUDDivGrid = options.CRUDDivGrid || "";
   var CRUDDivGridBtnPage = options.CRUDDivGridBtnPage || "";

   var CRUDFormBtnLoad = options.CRUDFormBtnLoad || "";
   
   var CRUDFormBtnSave = options.CRUDFormBtnSave || "";
   var CRUDFormValidateFunction = options.CRUDFormValidateFunction || "";

   var CRUDFormBtnEdit = options.CRUDFormBtnEdit || "";
   var CRUDFormEditFunction = options.CRUDFormEditFunction || "";
   var CRUDFormBtnRemove = options.CRUDFormBtnRemove || "";
   
   var CRUDGridReload = options.CRUDGridReload || true;

   var CRUDPostCompleteFunction = options.CRUDPostCompleteFunction || "";


   //LOAD----------------------------------
   $(document).on("click", CRUDFormBtnLoad , function(event)
   {
      event.preventDefault();
      event.stopPropagation();
      
      deltaCom("GET",dComBus +"/index.php"+"/"+CRUDModule + "/null","","loading",true);            
      
   });
   
   //paging------------------------
   $(document).on("click", CRUDDivGridBtnPage , function(event)
   {
      event.preventDefault();
      event.stopPropagation();
            
      deltaCom("GET",dComBus +"/index.php"+"/"+CRUDModule + "/"+$(this).data("pagenumber"),"","loading",true);          
   });
   
   
   //EDIT--------------------------------------------
   $(document).on("click", CRUDFormBtnEdit, function(event)
   {
      event.preventDefault();
      event.stopPropagation();

      $(CRUDFormBtnSave).html("Update");
      $(CRUDFormBtnSave).data("id",$(this).data("id"));
      if(CRUDFormEditFunction !=""){window[CRUDFormEditFunction](this);};           
   });

   
   //SAVE/UPDATE------------------------------
   $(document).on("click", CRUDFormBtnSave , function(event)
   {
      event.preventDefault();
      event.stopPropagation();

      if(CRUDFormValidateFunction != "")
      {
         if(!window[CRUDFormValidateFunction]())
         {
            return;
         }
      }
      
      var FormNGridTempUrl = "";
      if($(CRUDFormBtnSave).data("id")=="null")
      {
         FormNGridTempUrl = dComBus +"/index.php"+"/"+CRUDModule +"/null";
      }
      else
      {
         FormNGridTempUrl = dComBus +"/index.php"+"/"+CRUDModule +"/"+$(CRUDFormBtnSave).data("id");
      }
      
      deltaCom("POST",FormNGridTempUrl,$(CRUDForm).serialize(),"saving",true);
      
   });
   
   
   //REMOVE------------------------------------------
   $(document).on("click", CRUDFormBtnRemove , function(event)
   {
      event.preventDefault();
      event.stopPropagation();
      
      deltaCom("DELETE", dComBus +"/index.php"+"/"+CRUDModule + "/"+$(this).data("id"), "", "removing",true);

   });   



   function deltaCom(method, URL, data, msg, reload)
   {
      $(CRUDFormDivMsg).html("Processing...");


      $.ajax(
      {
         method: method,
         url: URL,
         data:data
      })
      .done(function(data)
      {
         if(data=="error")
         { 
            $(CRUDFormDivMsg).html("Error while "+msg);
            clearMsg(CRUDFormDivMsg);
            
            if(method=="GET"){$(CRUDDivGrid).html("");}
         } 
         else
         {              
            $(CRUDFormDivMsg).html("Completed "+msg+" Succcessfully");
            clearMsg(CRUDFormDivMsg);
            
            if(reload==true){$(CRUDDivGrid).html(data);}
         }
         
         
         if(method=="POST")
         {
            $(CRUDFormBtnSave).data("id","null");
            $(CRUDFormBtnSave).html("Save");
            $(CRUDForm)[0].reset();
         }
         
         if(CRUDPostCompleteFunction!=""){window[CRUDPostCompleteFunction]();}
      })
      .fail(function(jqXHR, textStatus, error)
      {
         $(CRUDFormDivMsg).html("Error while "+msg);
         clearMsg(CRUDFormDivMsg);
         
         if(method=="POST")
         {
            $(CRUDFormBtnSave).data("id","null");
            $(CRUDFormBtnSave).html("Save");
            $(CRUDForm)[0].reset();
         }
      })
      .always(function()
      {
         //complete code
      });
   }
}// END OF CRUD

//==USER LOG==============================================================================================
function FormNGridUserLog(options)
{ 
   var dComBus = options.dComBus || "";
   var userLoginModule = options.userLoginModule || "";
   var userLoginForm = options.userLoginForm || "";
   var userLoginFormValidateFunction = options.userLoginFormValidateFunction || "";
   var userLoginFormDivMsg = options.userLoginFormDivMsg || "";
   var userLonginButton = options.userLonginButton || "";
   var userLongoutButton = options.userLongoutButton || "";
   var userLonginRedirect = options.userLonginRedirect || "";
   var userLongoutRedirect = options.userLongoutRedirect || "";


   //LogIn---------------------------------------------
   $(document).on("click", userLonginButton , function(event)
   {
      event.preventDefault();
      event.stopPropagation();

      if(userLoginFormValidateFunction != "")
      {
         if(!window[userLoginFormValidateFunction]())
         {
            return;
         } 
      }
       
   
      $.ajax(
      {
         url: dComBus +"/index.php"+"/"+userLoginModule +"/login",
         data: $(userLoginForm ).serialize()
      })
      .done(function(data)
      {
         if(data=="valid")
         {
            document.location = userLonginRedirect ;
         }
         else
         {
            $(userLoginFormDivMsg).html(data);
            clearMsg(userLoginFormDivMsg);
         }
      })
      .fail(function(jqXHR, textStatus, error)
      {
            $(userLoginFormDivMsg).html("Error while loading");

      });
   });
   
   
   //LogOut--------------------------------------------------------
   $(document).on("click", userLongoutButton , function(event)
   {  
      event.preventDefault();
      event.stopPropagation();

      $.ajax(
      {
         url: dComBus +"/index.php"+"/"+userLoginModule +"/logout"
      })
      .done(function(data)
      {   
         if(data=="valid")
         {
            document.location = userLongoutRedirect ;
         }
      });//End of Logout
   });
}//End of User Log