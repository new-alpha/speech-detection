document.addEventListener('DOMContentLoaded', speechToEmotion, false);

function speechToEmotion() {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = true;

  recognition.onresult = function (event) {
    const results = event.results;
    const transcript = results[results.length - 1][0].transcript;

    document.getElementById("texting").innerHTML = transcript;

    setEmoji('searching');

    fetch(`/emotion?text=${transcript}`)
      .then((response) => response.json())
      .then((result) => {
        if (result.score > 0) {
          setEmoji('positive');
          document.getElementById('nana').innerHTML = "You sound Positive";
        } else if (result.score < 0) {
          setEmoji('negative');
          document.getElementById('nana').innerHTML = "You sound Negative";
        } else {
          setEmoji('neutral');
          document.getElementById('nana').innerHTML = "You sound Neutral";
        }
      })
      .catch((e) => {
        console.error('Request error -> ', e);
        recognition.abort();
      });
  };

  recognition.onerror = function (event) {
    console.error('Recognition error -> ', event.error);
    setEmoji('error');
    document.getElementById('nana').innerHTML = "Couldn't understand";
  };

  recognition.onaudiostart = function () {
    setEmoji('listening');
    document.getElementById('nana').innerHTML = "I am listening";
  };

  recognition.onend = function () {
    setEmoji('idle');
    document.getElementById('nana').innerHTML = "Sitting here idle";
  };

  recognition.start();

  function setEmoji(type) {
    const emojiElem = document.querySelector('.emoji img');
    emojiElem.classList = type;
  }
}
