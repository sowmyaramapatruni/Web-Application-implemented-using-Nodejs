    <input type="text" id= "passenger-1-name" class="passenger_details" placeholder="Enter full name" data-passenger-count = "<%=passenger_count%>" data-class-id = "<%=class_type %>">
           </div>

           <div class="row">
             <div class="col-sm-6"> <input type="text" id = "passenger-1-email" placeholder="enter email" class="passenger_details"> </div>
             <div class="col-sm-6"> <input type="text" id = "passenger-1-phone" placeholder="enter phone number" class="passenger_details"> </div>
           </div>
          </div>
          <%if(passenger_count > 1) {%>
          <h4 class="md-heading">Other Passengers</h4>
          <%}%>
         <%for(var i =2; i <= passenger_count; i++){ %>
         <div id = "passenger-<%=i %>-div" class="row">
         <input type="text" id = "passenger-<%=i %>-name" placeholder="Enter full name" class="passenger_details">
          </div>
         <%}%>

       <div class="modal-footer">
          <button type="button" id="modal_submit" class="btn btn-default">Submit</button>
         <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
       </div>
     </div>

   </div>
 </div>
</div>

<div class="modal fade" id="booking_myModal" role="dialog">
   <div class="modal-dialog">

     <!-- Modal content-->
     <div class="modal-content">
       <div class="modal-body">
          <h4 id="booking_id">   </h4>
       <div class="modal-footer">
         <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
       </div>
     </div>

   </div>
 </div>
</div>