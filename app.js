
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const app=express();
const https=require("https");
const ip = require('ip');
let lat="";
let long="";
let service="";
let timez="";
let addres="";
let ip_num="";
let topo=false;
let topo_stat="";
let condition="";
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.post("/",function(req,res) {
  console.log(req.body.ipadd);
  ip_num=req.body.ipadd;
  const key=""+process.env.KEY;
  console.log(key);
  const url="https://ipgeolocation.abstractapi.com/v1/?api_key="+key+"&ip_address="+ip_num;
  https.get(url,function(response) {
    response.on("data",function(data) {
      const geo_loc=JSON.parse(data);
      try {
      lat=geo_loc.longitude;
      long=geo_loc.latitude;
      console.log(geo_loc.connection.isp_name);
     service=geo_loc.connection.isp_name;
      timez=geo_loc.timezone.abbreviation;
      addres=geo_loc.city+","+geo_loc.region+"<br>"+geo_loc.postal_code;
      console.log(lat+">"+long+">"+service+">"+timez);
      res.redirect("/next");
    }
    catch(err){
          res.redirect("/fail");
        }
    });
  });
});
app.post("/check",function(req,res) {
  topo=false;
  if(req.body.topology==="true")
  topo=true;
  res.redirect("/next");
});
app.get("/fail",function(req,res) {
  res.render("failure");
});
app.get("/",function(req,res) {
  let my_ip=req.ip;
  res.render("iptrack",{my_ip:my_ip});
});
app.get("/next",function(req,res) {
  if(topo===true) {
      topo_stat="flexSwitchCheckChecked"+" checked";
      condition="satellite-streets-v11";
  }
  else {
    topo_stat="flexSwitchCheckDefault";
    condition="streets-v11";
}
  res.render("next",{ip:ip_num,loc:addres,tzone:timez,isp:service,lat:lat,long:long,topo_stat:topo_stat,condition:condition});
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,function() {
  console.log("Server started");
})
