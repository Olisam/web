//(function() {

    var config = {
        apiKey: "AIzaSyDHT_DhUa87uFJcUAW60Msgz1hhdjsizlE",
        authDomain: "raspberry-6c3a6.firebaseapp.com",
        projectId: "raspberry-6c3a6",
        storageBucket: "raspberry-6c3a6.appspot.com",
        messagingSenderId: "71556025685",
        appId: "1:71556025685:web:f67c1d6290a95d478ff3dc",
        measurementId: "G-PFH5G5D26H"
      };
    firebase.initializeApp(config);
    var db = firebase.firestore();
    const docRef = db.collection("Temperature");
    const currentDocRef = docRef.doc("current");

    setInterval(updatePage, 1000);
    setTimeout(updateChart, 1000);
    setInterval(getCurrent, 60000);
    setInterval(refreshChart, 1000);
    
    var posts = [];
    var dates = [];
    var newposts = [];
    

    db.collection("Temperature").where("id", "==", "0000062c5cdf")
            .onSnapshot(function(querySnapshot) {
                posts = [];
                querySnapshot.forEach(function(doc) {

                    var pTimestamp = parseInt(doc.data().timestamp, 10);
                    

                    posts.push({
                        x: pTimestamp,
                        y: doc.data().temp
                    });
                    
                });

                newposts = posts.sort(function(x, y){
                    return x.x - y.x;
                });
                console.log(newposts);

            });

    var roundedNumb = 0;


    currentDocRef.get().then(function (doc) {
        if (doc && doc.exists) {
            const myData = doc.data();
            var numb = myData.temp;
            roundedNumb = Math.round(numb * 10) / 10;
        }
    })

    function getCurrent() {
        currentDocRef.get().then(function (doc) {
            if (doc && doc.exists) {
                const myData = doc.data();
                var numb = myData.temp;
                roundedNumb = Math.round(numb * 10) / 10;
            }
        })
    }

    function returnDate(uTimestamp) {
        var rounduTimestamp = parseInt(uTimestamp, 10);
        var milliseconds = rounduTimestamp * 1000;
        var dateObject = new Date(milliseconds);
        var humanDate = dateObject.toLocaleString();
        return humanDate;
    }

    function updatePage() {
        document.getElementById("n1").innerText = roundedNumb + "°C";
    }

    function updateChart() {
        let myChart = document.getElementById("myChart").getContext("2d");
  
        let massPopChart = new Chart(myChart, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    data: newposts,
                    label: 'temperature',
                    borderColor: '#ff0000',
                    fill: false
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'linear'
                    }]
                }
            }
        });
    }

    function refreshChart() {
        massPopChart.update();
    }

//})();
