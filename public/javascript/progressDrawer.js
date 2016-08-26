//Progress bar drawing
  var $pc = $('#progressController');
  var $pCaption = $('.progress-bar p');
  var iProgress = document.getElementById('inactiveProgress');
  var aProgress = document.getElementById('activeProgress');
  var iProgressCTX = iProgress.getContext('2d');


  drawInactive(iProgressCTX);

  $pc.on('change', function(){
    var percentage = $(this).val() / 100;
    drawProgress(aProgress, percentage, $pCaption);
  });

  function drawInactive(iProgressCTX){
    iProgressCTX.lineCap = 'square';


    //progress bar
    iProgressCTX.beginPath();
    iProgressCTX.lineWidth = 0;
    iProgressCTX.fillStyle = '#e6e6e6';
    iProgressCTX.arc(137.5,137.5,85.2,0,2*Math.PI);
    iProgressCTX.fill();

    //progressbar caption
    iProgressCTX.beginPath();
    iProgressCTX.lineWidth = 0;
    iProgressCTX.fillStyle = '#fff';
    iProgressCTX.arc(137.5,137.5,74,0,2*Math.PI);
    iProgressCTX.fill();

  }
  function drawProgress(bar, percentage, $pCaption){
    var barCTX = bar.getContext("2d");
    var quarterTurn = Math.PI / 2;
    var endingAngle = ((2*percentage) * Math.PI) - quarterTurn;
    var startingAngle = 0 - quarterTurn;

    bar.width = bar.width;
    barCTX.lineCap = 'square';

    barCTX.beginPath();
    barCTX.lineWidth = 10.2;
    barCTX.strokeStyle = '#76e1e5';
    barCTX.arc(137.5,137.5,80.4,startingAngle, endingAngle);
    barCTX.stroke();

    $pCaption.text( (parseInt(percentage * 100, 10)) + '%');
  }

    var percentage = $pc.val() / 100;
    drawProgress(aProgress, percentage, $pCaption);
