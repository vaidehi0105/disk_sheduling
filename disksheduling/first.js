var res,pro;
function BuildFormFields($amount) 
{
    res = $amount;
    if(res<0)
        alert("Invalid Inputs");
		var
			$container = document.getElementById('FormFields'),
			$item, $field, $i;
			$container.innerHTML = '';
	for ($i = 0; $i < $amount; $i++) {
        $item = document.createElement('div');
        $item.style.margin = '10px';
        $field = document.createElement('label');
        $field.innerHTML = 'Element '+$i;
		$item.appendChild($field);
		$field = document.createElement('input');
		$field.name = 'Design[' + $i + ']';
		$field.type = 'text';
        $field.setAttribute("class","form-control");
		$item.appendChild($field);
		$container.appendChild($item);
	}
}

$('#btnCalculate').on('click', function(){

    if (res == 0) {
        alert('Please insert some elements');
        return;
    }

    var selectedAlgo = $('#algorithmSelector').children('option:selected').val();

    if (selectedAlgo === 'optFCFS') {
        FCFS();
    }

    if (selectedAlgo === 'optSSTF') {
        SSTF();
    }

    if (selectedAlgo === 'optSCAN') {
        SCAN();
    }

    if (selectedAlgo === 'optCSCAN') {
        CSCAN();
    }

    if (selectedAlgo === 'optLOOK') {
        LOOK();
    }

    if (selectedAlgo === 'optCLOOK') {
        CLOOK();
    }
});

const disk_size = 200;

function FCFS() {
    var req_arr = document.request_arr;
    var arr = [];
    var head = 50;
    var seek_sequence = [];

    for(var i = 1; i <= res; i++){
        arr[i-1] = Number(req_arr[i].value);
    }
    const size = arr.length;
    console.log(arr);

    var seek_count = 0;
    var distance, cur_track;

    for(var i = 0; i < size; i++){
        cur_track = arr[i];
        seek_sequence.push(cur_track);
        distance = Math.abs(cur_track - head);
        seek_count += distance;
        head = cur_track;
    }

    console.log(seek_count);
    console.log(seek_sequence);

    var li = document.createElement("li");

    for(var i = 0; i < seek_sequence.length; i++){
        li.appendChild((document.createTextNode(seek_sequence[i] + " -> ")))
    }
    var results = document.getElementById("seekSequence");
    results.appendChild(li);
    $("#seekCount").val(seek_count);
}

function SSTF() {
    var req_arr = document.request_arr;
    var arr = [];
    var head = 50;
    var seek_sequence = [];

    for(var i = 1; i <= res; i++){
        arr[i-1] = Number(req_arr[i].value);
    }
    const size = arr.length;
    console.log(arr);
    var seek_count = 0;

    var aux = [];
    for(var i = 0; i < size; ++i) {
        aux[i] = [ ];
        // for(var j = 0; j < 2; ++j) {
            aux[i][0] = 0;
            aux[i][1] = 0; 
            // a[i] is now an array so this works.
        // }
    }

    for(var i = 0; i < size; i++){
        seek_sequence[i] = head;
        for (var j = 0; j < size; ++j)
		{
			aux[j][0] = arr[j] - head;
			if (aux[j][0] < 0)
			{
				aux[j][0] = -aux[j][0];
			}
        }
        var min = Number.MAX_VALUE;
        var location = -1;
        for(var j = 0; j < size; j++){
            if(aux[j][1] == 0 && aux[j][0] <= min){
                location = j;
                min = aux[j][0];
            }
        }
        aux[location][1] = 1;
		// Update head data into current track value
		head = arr[location];
		// Add current distance into seek
		seek_count += aux[location][0];
    }
    if(head != 0){
        seek_sequence[size] = head;
    }

    console.log(seek_count);
    console.log(seek_sequence);

    var li = document.createElement("li");

    for(var i = 0; i < seek_sequence.length; i++){
        li.appendChild((document.createTextNode(seek_sequence[i] + " -> ")))
    }
    var results = document.getElementById("seekSequence");
    results.appendChild(li);
    $("#seekCount").val(seek_count);
}

function SCAN(){
    var req_arr = document.request_arr;
    var arr = [];
    var head = 50;

    for(var i = 1; i <= res; i++){
        arr[i-1] = Number(req_arr[i].value);
    }
    const size = arr.length;
    console.log(arr);

    var seek_count = 0;
    var distance, cur_track;
    var left = [], right = [];
    var seek_sequence = [];
    var dir = document.getElementById("direction").value;
    console.log(dir);

    if(dir == "left"){
        left.push(0);
    }
    else if (dir == "right"){
        right.push(disk_size - 1);
    }

    for (var i = 0; i < size; i++) {
        if (arr[i] < head)
            left.push(arr[i]);
        if (arr[i] > head)
            right.push(arr[i]);
    }

    left.sort(function(a, b){return a - b});
    right.sort(function(a, b){return a - b});

    var run = 2;
    while(run--){
        if(dir == "left"){
            for(var i = left.length - 1; i>=0; i--){
                cur_track = left[i];
                seek_sequence.push(cur_track);
                distance = Math.abs(cur_track - head);
                seek_count += distance;
                head = cur_track;
            }
            dir = "right";
        }
        else if(dir == "right"){
            for(var i = 0; i < right.length; i++){
                cur_track = right[i];
                seek_sequence.push(cur_track);
                distance = Math.abs(cur_track - head);
                seek_count += distance;
                head = cur_track;
            }
            dir = "left";
        }
    }

    console.log(seek_count);
    console.log(seek_sequence);

    var li = document.createElement("li");

    for(var i = 0; i < seek_sequence.length; i++){
        li.appendChild((document.createTextNode(seek_sequence[i] + " -> ")))
    }
    var results = document.getElementById("seekSequence");
    results.appendChild(li);
    $("#seekCount").val(seek_count);
}

function CSCAN() {

    var req_arr = document.request_arr;
    var arr = [];
    var head = 50;

    for(var i = 1; i <= res; i++){
        arr[i-1] = Number(req_arr[i].value);
    }
    var size = arr.length;
    console.log(arr);

    var seek_count = 0;
    var distance, cur_track;
    var left = [], right = [];
    var seek_sequence = [];

    left.push(0);
    right.push(disk_size - 1);

    for (var i = 0; i < size; i++) {
        if (arr[i] < head)
            left.push(arr[i]);
        if (arr[i] > head)
            right.push(arr[i]);
    }

    left.sort(function(a, b){return a - b});
    right.sort(function(a, b){return a - b});

    for (let i = 0; i < right.length; i++)
    {
        cur_track = right[i];
         
        // appending current track to seek sequence
        seek_sequence.push(cur_track);

        // calculate absolute distance
        distance = Math.abs(cur_track - head);

        // increase the total count
        seek_count += distance;

        // accessed track is now new head
        head = cur_track;
    }
    // once reached the right end
        // jump to the beggining.
        head = 0;
 
        // adding seek count for head returning from 199 to 0
        seek_count += (disk_size - 1);
 
        // Now service the requests again
        // which are left.
        for (let i = 0; i < left.length; i++) {
            cur_track = left[i];
 
            // appending current track to seek sequence
            seek_sequence.push(cur_track);
 
            // calculate absolute distance
            distance = Math.abs(cur_track - head);
 
            // increase the total count
            seek_count += distance;
 
            // accessed track is now the new head
            head = cur_track;
        }

        console.log(seek_count);
        console.log(seek_sequence);

    var li = document.createElement("li");

    for(var i = 0; i < seek_sequence.length; i++){
        li.appendChild((document.createTextNode(seek_sequence[i] + " -> ")))
    }
    var results = document.getElementById("seekSequence");
    results.appendChild(li);
    $("#seekCount").val(seek_count);
}

function LOOK() {
    var req_arr = document.request_arr;
    var arr = [];
    var head = 50;

    for(var i = 1; i <= res; i++){
        arr[i-1] = Number(req_arr[i].value);
    }
    var size = arr.length;
    console.log(arr);

    var seek_count = 0;
    var distance, cur_track;
    var left = [], right = [];
    var seek_sequence = [];
    var dir = document.getElementById("direction").value;
    console.log(dir);

    for(var i = 0; i < size; i++){
        if (arr[i] < head)
            left.push(arr[i]);
        if (arr[i] > head)
            right.push(arr[i]);
    }

    left.sort(function(a, b){return a - b});
    right.sort(function(a, b){return a - b});

    var run = 2;
    while (run--) {
        if(dir == "left"){
            for(var i = left.length-1; i >= 0; i--){
                cur_track = left[i];
                seek_sequence.push(cur_track);
                distance = Math.abs(cur_track - head);
                seek_count += distance;
                head = cur_track;
            }
            dir = "right";
        }
        else if(dir == "right"){
            for(var i = 0; i < right.length; i++){
                cur_track = right[i];
                seek_sequence.push(cur_track);
                distance = Math.abs(cur_track - head);
                seek_count += distance;
                head = cur_track;
            }
            dir = "left";
        }
    }

    console.log(seek_count);
    console.log(seek_sequence);

    var li = document.createElement("li");

    for(var i = 0; i < seek_sequence.length; i++){
        li.appendChild((document.createTextNode(seek_sequence[i] + " -> ")))
    }
    var results = document.getElementById("seekSequence");
    results.appendChild(li);
    $("#seekCount").val(seek_count);
}

function CLOOK() {
    var req_arr = document.request_arr;
    var arr = [];
    var head = 50;

    for(var i = 1; i <= res; i++){
        arr[i-1] = Number(req_arr[i].value);
    }
    var size = arr.length;
    console.log(arr);

    var seek_count = 0;
    var distance, cur_track;
    var left = [], right = [];
    var seek_sequence = [];

    for(var i = 0; i < size; i++){
        if (arr[i] < head)
            left.push(arr[i]);
        if (arr[i] > head)
            right.push(arr[i]);
    }

    left.sort(function(a, b){return a - b});
    right.sort(function(a, b){return a - b});

    for(var i = 0; i < right.length; i++){
        cur_track = right[i];
        seek_sequence.push(cur_track);
        distance = Math.abs(cur_track - head);
        seek_count += distance;
        head = cur_track;
    }

    seek_count += Math.abs(head - left[0]);
    head = left[0];

    for(var i = 0; i < left.length; i++){
        cur_track = left[i];
        seek_sequence.push(cur_track);
        distance = Math.abs(cur_track - head);
        seek_count += distance;
        head = cur_track;
    }

    console.log(seek_count);
    console.log(seek_sequence);

    var li = document.createElement("li");

    for(var i = 0; i < seek_sequence.length; i++){
        li.appendChild((document.createTextNode(seek_sequence[i] + " -> ")))
    }
    var results = document.getElementById("seekSequence");
    results.appendChild(li);
    $("#seekCount").val(seek_count);
}