const stats = new Stats();
stats.setMode( 0 );
document.body.appendChild( stats.domElement );

const canvas = document.createElement('canvas');
canvas.width = 512;
canvas.height = 512;
document.body.appendChild( canvas );

const context = canvas.getContext('2d');
context.fillStyle = 'rgba(127,0,255,0.05)';
setInterval( function () {
    let time = Date.now() * 0.001;
    context.clearRect( 0, 0, 512, 512 );
    stats.begin();
    for (let i = 0; i < 2000; i ++ ) {
        let x = Math.cos(time + i * 0.01) * 196 + 256;
        let y = Math.sin( time + i * 0.01234 ) * 196 + 256;
        context.beginPath();
        context.arc( x, y, 10, 0, Math.PI * 2, true );
        context.fill();
    }
    stats.end();
}, 1000 / 60 );