(async ()=>{
  const delay = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const $words = document.querySelector('#_BLOCK_ .words');
  let content = {{ content | json }}.split("\n");
  let duration = 1000 * {{ duration | json }};
  let transition = 1000 * {{ transition | json }};

  {% if effect=="typewriter" %}
    while(true) {
      for(let word of content) {
        // Write
        for(let i=0;i<=word.length;i++) {
          $words.innerText = word.substring(0, i);
          await delay(duration / (word.length * 2.5));
        }
        await delay(0.5 * duration / 2.5);
        // Erase
        for(let i=word.length;i>=0;i--) {
          $words.innerText = word.substring(0, i);
          await delay(duration / (word.length * 2.5));
        }
        await delay(transition);
      }
    }
  {% else %}
    let $words_ = [];
    $words.innerHTML = '';
    for(let word of content) {
      let ele = document.createElement('span');
      {% if effect=="fallingLetters" %}
        let k = 0;
        for(let letter of word) {
          let eleLet = document.createElement('span');
          eleLet.innerText = letter;
          eleLet.style.transitionDelay = (k * transition / word.length) + 'ms';
          ele.appendChild(eleLet);
          k++;
        }
      {% else %}
        ele.innerText = word;
      {% endif %}
      $words_.push(ele);
      $words.appendChild(ele);
    }
    let i=0;
    while(true) {
      let $prev = $words_[(i-1)>=0?(i-1):$words_.length-1];
      $prev.setAttribute('data-status', 'prev');
      let $next = $words_[(i+1) % $words_.length];
      $next.setAttribute('data-status', 'next');
      $words_[i].setAttribute('data-status', 'current');
      await delay(duration);
      i = (i+1) % $words_.length;
    }
  {% endif %}
})();