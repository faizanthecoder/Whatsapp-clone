
   
//         let bars=document.querySelector("#bars")
//         let q1=document.querySelectorAll(".q1")
//         let sidetext=document.querySelector(".side-text")
// let tio=document.querySelector(".top-icon-outer")
// let ctm=document.querySelector("ctm")
// console.dir(q1)


document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".side-bar");
    const bars = document.getElementById("bars");

    // Sidebar starts hidden (closed)
    sidebar.classList.add("closed");

    bars.addEventListener("click", () => {
        sidebar.classList.toggle("closed");
    });
});
        // bars.addEventListener("click",function(){
        //     sidetext.classList.toggle("visible")
        //     tio.classList.toggle("absolute");
        //     tio.style="animation: slideInRight 1s ease-out forwards;"

        //     // absoulte.classList.remove="position: absolute;"
        //     console.log("tio");
            

        // })


//         q1.forEach(b => {
//             b.addEventListener("click",function(){
//                   sidetext.classList.toggle("visible")
//             absoulte.classList.toggle("absolute");
//             absoulte.style="    animation: slideInRight 1s ease-out forwards;"

//             // absoulte.classList.remove="position: absolute;"
//             console.log("absoulte");
// // console.log("ok");
//             })

//         });
            // bars.addEventListener("click",function(){
            //    .forEach(e => {
            //         console.log(e);
                    
            //     });
            // sidetext.classList.toggle("visible")
            // absoulte.classList.toggle("absolute");
            // absoulte.style="    animation: slideInRight 1s ease-out forwards;"

            // // absoulte.classList.remove="position: absolute;"
            // console.log("absoulte");
            

        // })
        
        //       bars.forEach(a => {
        //         a.addEventListener("click",function(){
        //     sidetext.classList.toggle("visible")
        //     absoulte.classList.toggle("absolute");
        //     absoulte.style="    animation: slideInRight 1s ease-out forwards;"

        //     // absoulte.classList.remove="position: absolute;"
        //     console.log("absoulte");
        //       });
          
            

        // })

        // let q12=[1,2,3]
        // q12.forEach(e => {
        //     console.log(e);
            
        // //    e. addEventListener("click",function().fore{
        // //     sidetext.classList.toggle("visible")
        // //     absoulte.classList.toggle("absolute");
        // //     absoulte.style="    animation: slideInRight 1s ease-out forwards;"

        // //     // absoulte.classList.remove="position: absolute;"
        // //     console.log("absoulte");
        // }); 
            

        