
var osmo = require('../lib/osmo');
var model = {};

//Model ariables
var coins = 0;
var bottles = 10;

model.beforetest = function(){
  coins = 0;
  bottles = 10;
  console.log('Initialize test case..');
};

model.aftertest = function(){
  coins = 0;
  bottles = 10;
  console.log('Close test case..');
};


model.guard_20cents = function(){
  return true;
};

model.step_20cents = function(){
  console.log('insert 20');
  coins += 20;
};


model.guard_vend = function(){
  return coins > 100;
};

model.step_vend = function(){
  console.log('Vend');
  coins = coins - 100;
  bottles = bottles - 1;
};

model.endcondition = function(){
  if (bottles === 0){
    console.log('No more bottles');
    return true;
  }
  return false;
};

model.post_vend = function(){
  console.log('bottles: ' + bottles);
  console.log('coins: ' + coins);
  console.log('');
};

osmo.setDebug(true);
osmo.setTestLength(100);
osmo.generate(model);
