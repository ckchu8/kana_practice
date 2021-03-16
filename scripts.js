var KanaQuiz = {
  kana: [
    "a", "i", "e", "u", "o",
    "ba", "be", "bi", "bo", "bu",
    "bya", "byo", "byu",
    "cha", "chi", "cho", "chu",
    "da", "de", "do",
    "fu",
    "ga", "ge", "gi", "go", "gu",
    "gya", "gyo", "gyu",
    "ha", "he", "hi", "ho",
    "hya", "hyo", "hyu",
    "ja", "ji", "ji_", "jo", "ju",
    "ka", "ke", "ki", "ko", "ku",
    "kya", "kyo", "kyu",
    "ma", "me", "mi", "mo", "mu",
    "mya", "myo", "myu",
    "n", "na", "ne", "ni", "no", "nu",
    "nya", "nyo", "nyu",
    "pa", "pe", "pi", "po", "pu",
    "pya", "pyo", "pyu",
    "ra", "re", "ri", "ro", "ru",
    "rya", "ryo", "ryu",
    "sa", "se", "shi", "so", "su",
    "sha", "sho", "shu",
    "ta", "te", "to", "tsu",
    "wa", "wo",
    "ya", "yo", "yu",
    "za", "ze", "zo", "zu", "zu_"
  ],
  
  hiragana: [],
  katakana: [],
  currentAnswer: "",
  currentKana: "",
  numRight: 0,
  numWrong: 0,
  wrongValues: [],

  initQuiz: function() {
    var that = this;
    $.each(this.kana, function(index, value) {
      that.hiragana.push(value);
      that.katakana.push(value);
    });

    this.setCurrentValue();
    this.bindForm();
  },

  setCurrentValue: function() {
    var directory = "";
    if(this.hiragana.length == 0 && this.katakana.length == 0) {
      this.finishQuiz();
      return;
    }
    else if(this.hiragana.length == 0 || this.katakana.length == 0) {
      directory = this.hiragana.length ? "hiragana" : "katakana";
    }
    else {
      var random = Math.ceil(Math.random() * 2);
      directory = random == 1 ? "hiragana" : "katakana";
    }

    if(directory === "hiragana") {
      this.hiragana = this.updateKana(this.hiragana);
      this.currentKana = "hiragana";
    }
    else {
      this.katakana = this.updateKana(this.katakana);
      this.currentKana = "katakana";
    }
    $('.kana-container').html('<img src="' + this.imagePath(directory, this.currentAnswer) + '" />');
  },

  updateKana: function(values) {
    var index = Math.ceil((Math.random() * values.length)) - 1;
    if(index === values.length-1) {
      this.currentAnswer = values.pop();
    }
    else {
      this.currentAnswer = values[index];
      if(index === 0) {
        values = values.slice(1);
      }
      else {
        values = values.slice(0, index).concat(values.slice(index+1))
      }
    }
    return values;
  },

  bindForm: function() {
    $('.answer-input').focus();
    var that = this;
    $('.kana-answer-form').on('submit', function(event) {
      event.preventDefault();
      that.checkAnswer();
    });
  },

  checkAnswer: function() {
    var input = $('.answer-input').val();
    var answer = this.currentAnswer.replace("_", "");
    if(input === answer) {
      $('.answer-response').html('<span class="correct">Correct!</span>');
      ++this.numRight;
    }
    else {
      $('.answer-response').html('<span class="wrong">Wrong: ' + answer + '</span>');
      ++this.numWrong;
      this.wrongValues.push([this.currentKana, this.currentAnswer, input]);
    }
    var that = this;
    setTimeout(function() {
      $('.answer-response').html('');
      that.setCurrentValue();
      $('.answer-input').val("");
    }, 1000);
  },

  imagePath: function(directory, filename) {
    return directory + "/" + filename + ".png";
  },

  finishQuiz: function() {
    var that = this;
    var content = ["<div>Quiz is over!</div>"]
    content.push('<div class="correct">Number correct: ' + this.numRight + '</div>');
    content.push('<div class="wrong">Number incorrect: ' + this.numWrong + '</div>');
    if(this.numWrong > 0) {
      content.push('<ul class="wrong-list">');
      content.push('<li>Incorrect answers</li>');
      content.push('<li><div class="kana">Kana</div><div class="answer">Answer</div><div class="guess">Guess</div></li>');
      $.each(this.wrongValues, function(index, pair) {
        content.push('<li>');
        content.push('<div class="kana"><img src="' + that.imagePath(pair[0], pair[1]) + '" /></div>');
        content.push('<div class="answer">' + pair[1].replace("_", "") + '</div>');
        content.push('<div class="guess">' + pair[2] + '</div>');
        content.push('</li>');
      });
      content.push('</ul>');
    }

    $('.quiz-content').html(content.join("\n"));
  }

}

$(document).ready(function() {

  KanaQuiz.initQuiz();

});
