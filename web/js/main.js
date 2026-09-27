(function(){
  /* 流程数据 */
  var STEPS=[
    {t:"咨询",p:"不套模板。哪一侧？先天还是外伤？平时怎么佩戴？顾问一对一沟通需求，先聊明白，再谈定制。"},
    {t:"免费试戴",p:"样品试戴，贴合度、社交距离下的观感当面确认，不合适就调——不满意，不勉强。"},
    {t:"确认定制效果",p:"结合试戴反馈与已脱敏的真实案例，确定方案与工艺档位，您点头再开工。"},
    {t:"数据采集/取模",p:"取健侧的形状、弧度、位置关系，一对一建档。「像不像」的地基在这一步。"},
    {t:"精工交付",p:"关键修型全手工雕刻，参照肤色 3-5 层逐层上色，耳根与皮肤自然过渡，成品交付。"},
    {t:"终身售后",p:"保养指导、后期维护、到期前提醒评估，戴了多久都有人管。"}
  ];
  var tabs=document.getElementById("stepTabs"),
      detail=document.getElementById("stepDetail"),
      cur=0;
  STEPS.forEach(function(s,i){
    var d=document.createElement("div");
    d.className="step-tab";
    d.innerHTML='<div class="num">'+(i+1<10?"0"+(i+1):i+1)+'</div><div class="tt">'+s.t+'</div>';
    d.addEventListener("click",function(){setStep(i);});
    tabs.appendChild(d);
  });
  function setStep(i){
    cur=i;
    var kids=tabs.children;
    for(var k=0;k<kids.length;k++)kids[k].classList.toggle("active",k===i);
    detail.innerHTML='<div class="fade"><h3>0'+(i+1)+' ｜ '+STEPS[i].t+'</h3><p>'+STEPS[i].p+'</p></div>';
  }
  setStep(0);
  /* 4.5s 自动轮播，用户点击后停止 */
  var auto=setInterval(function(){setStep((cur+1)%STEPS.length);},4500);
  tabs.addEventListener("click",function(){clearInterval(auto);});

  /* FAQ 手风琴 */
  var qas=document.querySelectorAll(".qa");
  qas.forEach(function(qa){
    var q=qa.querySelector(".q"),a=qa.querySelector(".a");
    q.addEventListener("click",function(){
      var open=qa.classList.contains("open");
      qas.forEach(function(o){o.classList.remove("open");o.querySelector(".a").style.maxHeight="0";});
      if(!open){qa.classList.add("open");a.style.maxHeight=a.scrollHeight+"px";}
    });
  });

  /* 滚动显现 */
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){e.target.classList.add("on");io.unobserve(e.target);}
    });
  },{threshold:.12});
  document.querySelectorAll(".reveal").forEach(function(el){io.observe(el);});

  /* 数字滚动 */
  function runCount(el){
    var to=+el.dataset.to,t0=null,dur=1200;
    function tick(ts){
      if(!t0)t0=ts;
      var p=Math.min((ts-t0)/dur,1),e=1-Math.pow(1-p,3);
      el.textContent=Math.round(to*e);
      if(p<1)requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var cio=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){runCount(e.target);cio.unobserve(e.target);}
    });
  },{threshold:.5});
  document.querySelectorAll(".count").forEach(function(el){cio.observe(el);});

  /* 导航：滚动阴影 + 高亮 + 返回顶部 */
  var nav=document.getElementById("nav"),toTop=document.getElementById("toTop");
  var sections=["products","cases","features","process","about","faq"].map(function(id){return document.getElementById(id);});
  var links=document.querySelectorAll(".nav-links a");
  function onScroll(){
    var y=window.scrollY;
    nav.classList.toggle("scrolled",y>10);
    toTop.classList.toggle("show",y>600);
    var pos=y+120,curId="";
    sections.forEach(function(s){if(s.offsetTop<=pos)curId=s.id;});
    links.forEach(function(a){a.classList.toggle("active",a.getAttribute("href")==="#"+curId);});
  }
  window.addEventListener("scroll",onScroll,{passive:true});
  onScroll();
  toTop.addEventListener("click",function(){window.scrollTo({top:0,behavior:"smooth"});});

  /* 预约按钮：手机=拨号；电脑=复制号码+气泡提示，绝不跳转 */
  var toast=document.createElement("div");
  toast.id="toast";document.body.appendChild(toast);
  var tTimer=null;
  function showToast(msg){
    toast.textContent=msg;toast.classList.add("show");
    clearTimeout(tTimer);tTimer=setTimeout(function(){toast.classList.remove("show");},2800);
  }
  function copyText(t){
    var ta=null,ok=false;
    function fallback(){
      try{
        ta=document.createElement("textarea");ta.value=t;
        ta.style.cssText="position:fixed;opacity:0;";document.body.appendChild(ta);
        ta.select();ok=document.execCommand("copy");
      }catch(e){}
      if(ta)ta.remove();
    }
    return new Promise(function(res){
      if(navigator.clipboard&&navigator.clipboard.writeText){
        navigator.clipboard.writeText(t).then(function(){res(true);},function(){fallback();res(ok);});
      }else{fallback();res(ok);}
    });
  }
  var isMobile=/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  document.querySelectorAll('a[href^="tel:"]').forEach(function(a){
    a.addEventListener("click",function(e){
      if(isMobile)return; /* 手机走系统拨号盘 */
      e.preventDefault(); /* 电脑拦截 tel: 跳转 */
      var num=a.dataset.tel||a.getAttribute("href").replace("tel:","");
      copyText(num).then(function(ok){
        showToast((ok?"✅ 已复制 ":"")+"客服电话 "+num+"，微信 / 企业微信搜索即可预约免费试戴");
      });
    });
  });
})();
