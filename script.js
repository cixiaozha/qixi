// 页面淡入效果
const stories = document.querySelectorAll('.story');
const options = {threshold: 0.2};
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
    }
  });
}, options);

stories.forEach(story => observer.observe(story));

// 粒子/烟花效果
class Particle {
  constructor(x, y, color){
    this.x = x;
    this.y = y;
    this.size = Math.random()*4+2;
    this.speedX = (Math.random()-0.5)*4;
    this.speedY = (Math.random()-0.5)*4;
    this.color = color;
    this.alpha = 1;
  }
  update(){
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= 0.02;
  }
  draw(ctx){
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function startFirework(canvas){
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const particles = [];
  for(let i=0;i<100;i++){
    const x = canvas.width/2;
    const y = canvas.height/2;
    const color = `hsl(${Math.random()*360},100%,70%)`;
    particles.push(new Particle(x,y,color));
  }
  function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach((p,i)=>{
      p.update();
      p.draw(ctx);
      if(p.alpha<=0) particles.splice(i,1);
    });
    if(particles.length>0){
      requestAnimationFrame(animate);
    }
  }
  animate();
}

// 点击图片触发烟花
const storyImages = document.querySelectorAll('.story-img');
storyImages.forEach(imgDiv=>{
  const canvas = imgDiv.querySelector('canvas');
  imgDiv.addEventListener('click', ()=>{
    startFirework(canvas);
  });
});
