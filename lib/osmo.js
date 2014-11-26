
var test_length = 10;
var test_case_count = 3;
var debug = false;

exports.setTestLength = function (length){
  test_length =  length;
};

exports.setTestCaseCount = function (count){
  test_case_count =  count;
};

exports.setDebug = function (d){
  debug =  d;
};

var log = function (text){
  if(debug === true){
    console.log(text);
  }
};

var _execute_if_exist = function (functionname, model){
  if(functionname in model){
    return _execute(functionname, model);
  }
};

var _execute = function (functionname, model){
  try {
    return model[functionname]();
  } catch (e) {
    throw new Error('Cannot execute: ' + functionname);
  }
};

var _check_possible_steps = function( model ){
  var possible_states = [];
  for(var key in model){
    if(key.search('guard_') === 0){
      //console.log('key: ' + key);
      if(model[key]() === true){
        possible_states.push(key.replace('guard_',''));
      }
    }
  }
  if (possible_states.length === 0){
    throw new Error('ERROR: no possible states');
  }
  return possible_states;
};

var _select_random_step = function( states ){
  return states[Math.floor(Math.random()*states.length)];
};

exports.generate = function (model){
  log('-- start to generate');

  _execute_if_exist('beforesuite', model);
  for( var case_index = 0; case_index < test_case_count; case_index++){
    log('');
    log('------ test case ' + (case_index + 1) + ' ------');

    _execute_if_exist('beforetest', model);
    for( var step_index = 0; step_index < test_length; step_index++){
      log('Step: ' + (case_index + 1) + '.' + (step_index + 1));

      possible_states = _check_possible_steps(model);
      selected_step = _select_random_step(possible_states);

      _execute_if_exist('pre_' + selected_step, model);
      _execute('step_'+selected_step, model);
      _execute_if_exist('post_' + selected_step, model);
      if (_execute_if_exist('endcondition', model) === true){
        //If end condition triggers then break the test case execution
        break;
      }

    }
    _execute_if_exist('aftertest', model);
  }
  _execute_if_exist('aftersuite', model);


};
