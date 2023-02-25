//Define Variables

let stop_Flag_Array = [false, false]
let Show_Flag_Array = [true, true]
let Rewind_Flag_Array = [false, false]
let Currant_Size_of_Graphing = [0, 0]
let Current_Color_Array = ["#151a27", "#151a27"]
let speed = Array.from(document.getElementsByClassName('speed'));
let File_Data_X = [[], []]
let File_Data_y = [[], []]
let Currant_Data_Graphing_Array_x = [[], []]
let Currant_Data_Graphing_Array_y = [[], []]
let label_input=["",""]
let Xlabel_input=["",""]
let Ylabel_input=["",""]
let rangeX=[[0,2],[0,2]];
let Deration=[0,0];
function readCSVFile(id, Graph_num) {

    var files = document.querySelector(`#${id}`).files;


    if (files.length > 0) {
        // Selected file
        var file = files[0];

        // FileReader Object
        var reader = new FileReader();

        // Read file as string 
        reader.readAsText(file);

        // Load event
        reader.onload = function (event) {

            // Read file data
            var csvdata = event.target.result;

            // Split by line break to gets rows Array
            var rowData = csvdata.split('\n');
            File_Data_X[Graph_num]=[]
            File_Data_y[Graph_num]=[]
            Array.from(rowData).forEach(row => {
                rowXY = row.split(',')
                File_Data_X[Graph_num].push(parseFloat(rowXY[0]))
                File_Data_y[Graph_num].push(parseFloat(rowXY[1]))
            })
            Currant_Size_of_Graphing[Graph_num]=0
            let trace1 = {
                x: [0],
                y: [0],
                type: 'scatter'
            };
            allTraces=document.getElementById(`myDiv${Graph_num}`).data;
            if(document.getElementById(`myDiv${Graph_num}`).childElementCount>0){
                Plotly.deleteTraces(`myDiv${Graph_num}`, [0]);
                Currant_Data_Graphing_Array_x[Graph_num]=[]
                Currant_Data_Graphing_Array_y[Graph_num]=[]     
                Currant_Size_of_Graphing[Graph_num]=0 
                Deration[Graph_num]=0
                rangeX[Graph_num]=[0,2]
            }
            else
            Plotly.newPlot(`myDiv${Graph_num}`, [trace1]);
            
            setInterval(() => graphing(), 200)

        };

    } else {
        alert("Please select a file.");
    }

}
function stopGraphing(Graph_num) {
    stop_Flag_Array[Graph_num] = true;
}
function continueGraphing(Graph_num) {
    stop_Flag_Array[Graph_num] = false
}
function changecolor(Graph_num) {
    Current_Color_Array[Graph_num] = document.getElementsByClassName('col')[Graph_num].value
}
function changeSpeed(Graph_num) {

    return 44 - parseInt(speed[Graph_num].value)
}

function graphing() {
    UpdateGraph(0)
    UpdateGraph(1)

}
function UpdateGraph(Graph_num) {
    if (Currant_Size_of_Graphing[Graph_num] < File_Data_X[Graph_num].length && !stop_Flag_Array[Graph_num]) {
        if(!Rewind_Flag_Array[Graph_num]){
        let NewDataX = File_Data_X[Graph_num].slice(Currant_Size_of_Graphing[Graph_num], Currant_Size_of_Graphing[Graph_num] + parseInt(speed[Graph_num].value))
        let NewDataY = File_Data_y[Graph_num].slice(Currant_Size_of_Graphing[Graph_num], Currant_Size_of_Graphing[Graph_num] + parseInt(speed[Graph_num].value))

        Currant_Data_Graphing_Array_x[Graph_num] = Currant_Data_Graphing_Array_x[Graph_num].concat(NewDataX)

        Currant_Data_Graphing_Array_y[Graph_num] = Currant_Data_Graphing_Array_y[Graph_num].concat(NewDataY)
        Currant_Size_of_Graphing[Graph_num] += parseInt(speed[Graph_num].value)
        UpdateGraphOnSite(Graph_num)

        }
        else{
            if( Currant_Size_of_Graphing[Graph_num]>=10){
            Currant_Data_Graphing_Array_x[Graph_num]= Currant_Data_Graphing_Array_x[Graph_num].splice(0, Currant_Data_Graphing_Array_x[Graph_num].length-parseInt(speed[Graph_num].value))
            Currant_Data_Graphing_Array_y[Graph_num]= Currant_Data_Graphing_Array_y[Graph_num].splice(0, Currant_Data_Graphing_Array_y[Graph_num].length-parseInt(speed[Graph_num].value))
            
            Currant_Size_of_Graphing[Graph_num] -= parseInt(speed[Graph_num].value)
            if(!(File_Data_X[Graph_num].length==0))
            
            UpdateGraphOnSite(Graph_num)
            }
    
    
        }
        Statistics(Graph_num)
    }
  
}
function UpdateGraphOnSite(Graph_num) {
    let layout = {
        title: {
          text:label_input[Graph_num]
         ,color:"#00000",
         font: {
            family: 'Courier New, monospace',
            size: 24
          } ,xref: 'paper',
          x: 0.05,
        },
        xaxis: {
          title: {
            text: Xlabel_input[Graph_num],
            font: {
              family: 'Courier New, monospace',
              size: 18,
              color: '#7f7f7f'
            },
          },
          range:rangeX[Graph_num]
          
        },
        yaxis: {
          title: {
            text:  Ylabel_input[Graph_num],
            font: {
              family: 'Courier New, monospace',
              size: 18,
              color: '#7f7f7f'
            }
          }
        }
      
      };
      Deration[Graph_num]++;

      if(Currant_Data_Graphing_Array_x[Graph_num][parseInt(Currant_Data_Graphing_Array_x[Graph_num].length)-1]+.1>rangeX[Graph_num][1]&&!Rewind_Flag_Array[Graph_num]){
       
       rangeX[Graph_num]=[Currant_Data_Graphing_Array_x[Graph_num][parseInt(Currant_Data_Graphing_Array_x[Graph_num].length)-100],Currant_Data_Graphing_Array_x[Graph_num][parseInt(Currant_Data_Graphing_Array_x[Graph_num].length)-2]+3]
        
      }

      else if(Rewind_Flag_Array[Graph_num]&&Currant_Data_Graphing_Array_x[Graph_num][parseInt(Currant_Data_Graphing_Array_x[Graph_num].length)-1]-.1<rangeX[Graph_num][0]){
      
        rangeX[Graph_num]=[Currant_Data_Graphing_Array_x[Graph_num][parseInt(Currant_Data_Graphing_Array_x[Graph_num].length)-10]-3,Currant_Data_Graphing_Array_x[Graph_num][parseInt(Currant_Data_Graphing_Array_x[Graph_num].length)-2]]
      }

    Plotly.react(`myDiv${Graph_num}`, [{
        x: Currant_Data_Graphing_Array_x[Graph_num],
        y: Currant_Data_Graphing_Array_y[Graph_num],
        type: 'scatter', marker: {
            color: Current_Color_Array[Graph_num]
        }

    }],layout);

    Plotly.restyle(document.getElementById(`myDiv${Graph_num}`), {  "visible": Show_Flag_Array[Graph_num]});

}
function Show_Hide(Graph_num) {
    Show_Flag_Array[Graph_num]=!Show_Flag_Array[Graph_num]
}
function Rewind(Graph_num) {
    Rewind_Flag_Array[Graph_num]=!Rewind_Flag_Array[Graph_num]
}

function ChangeTitle(Graph_num){
  label_input[Graph_num]=  document.getElementsByClassName('Title')[Graph_num].value

}
function ChangeXaXIS(Graph_num){
  Xlabel_input[Graph_num]=  document.getElementsByClassName('XAxis')[Graph_num].value

}
function ChangeYaXIS(Graph_num){
  Ylabel_input[Graph_num]=  document.getElementsByClassName('YAxis')[Graph_num].value

}
function Statistics(Graph_num) {
    document.getElementById(`mean${Graph_num}`).innerText=parseFloat((ss.mean(Currant_Data_Graphing_Array_y[Graph_num]))).toPrecision(3)
    document.getElementById(`min${Graph_num}`).innerText=parseFloat((ss.min(Currant_Data_Graphing_Array_y[Graph_num]))).toPrecision(3)
    document.getElementById(`max${Graph_num}`).innerText=parseFloat((ss.max(Currant_Data_Graphing_Array_y[Graph_num]))).toPrecision(3)
    document.getElementById(`STD${Graph_num}`).innerText=parseFloat((ss.standardDeviation(Currant_Data_Graphing_Array_y[Graph_num]))).toPrecision(3)
    document.getElementById(`der${Graph_num}`).innerText=parseFloat((Deration[Graph_num]*100)/1000).toPrecision(3)
}
