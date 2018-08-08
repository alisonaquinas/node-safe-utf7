var test = require('tape');
var utf7 = require('..');

test('test conversion from utf8 to utf7', function(assert) {
  assert.plan(22);

  // Examples from RFC 2152.
  assert.equal('+AEEiYgORAC4-', utf7.encodeAll('A\u2262\u0391.'));
  assert.equal('A+ImIDkQ-.', utf7.encode('A\u2262\u0391.'));

  assert.equal('+ZeVnLIqe-', utf7.encodeAll('\u65E5\u672C\u8A9E'));
  assert.equal('+ZeVnLIqe-', utf7.encode('\u65E5\u672C\u8A9E'));

  assert.equal('+AEgAaQAgAE0AbwBtACAALSY6AC0AIQ-', utf7.encodeAll('Hi Mom -\u263A-!'));
  assert.equal('Hi Mom -+Jjo--!', utf7.encode('Hi Mom -\u263A-!', ' !'));
  assert.equal('Hi+ACA-Mom+ACA--+Jjo--+ACE-', utf7.encode('Hi Mom -\u263A-!'));

  assert.equal('+AEkAdABlAG0AIAAzACAAaQBzACAAowAxAC4-', utf7.encodeAll('Item 3 is \u00A31.'));
  assert.equal('Item 3 is +AKM-1.', utf7.encode('Item 3 is \u00A31.', ' '));
  assert.equal('Item+ACA-3+ACA-is+ACAAow-1.', utf7.encode('Item 3 is \u00A31.'));

  // Custom examples that contain more than one mode shift.
  assert.equal('Jyv+AOQ-skyl+AOQ-', utf7.encode('Jyv\u00E4skyl\u00E4'));
  assert.equal('+AEoAeQB2AOQAcwBrAHkAbADk-', utf7.encodeAll('Jyv\u00E4skyl\u00E4'));

  assert.equal('+ACdPYFl9ACcAIABoAGUAaQDfAHQAIAAiAEgAYQBsAGwAbwAi-', utf7.encodeAll('\'\u4F60\u597D\' heißt "Hallo"'));
  assert.equal('\'+T2BZfQ-\' hei+AN8-t "Hallo"', utf7.encode('\'\u4F60\u597D\' heißt "Hallo"', ' "'));
  assert.equal('\'+T2BZfQ-\'+ACA-hei+AN8-t+ACAAIg-Hallo+ACI-', utf7.encode('\'\u4F60\u597D\' heißt "Hallo"'));

  // The plus sign is represented as +-.
  assert.equal('+AEgAbwB0ACAAKwAgAFMAcABpAGMAeQAgACsAIABGAHIAdQBpAHQAeQ-', utf7.encodeAll('Hot + Spicy + Fruity'));
  assert.equal('Hot +- Spicy +- Fruity', utf7.encode('Hot + Spicy + Fruity', ' '));
  assert.equal('Hot+ACAAKwAg-Spicy+ACAAKwAg-Fruity', utf7.encode('Hot + Spicy + Fruity'));

  // Slashes in the beginning.
  assert.equal('+///typh2VDIf7Q-', utf7.encodeAll('\uffff\uedca\u9876\u5432\u1fed'));

  // + sign around non-ASCII chars
  assert.equal('+AOQAKwDkACsA5A-', utf7.encodeAll('\u00E4+\u00E4+\u00E4'));

  // Some special characters
  assert.equal('+ACEAIgCnACQAJQAmAC8AKAApAD0APwAnACoAKwAjAC0AXwAuADoALAA7ADwAPgB8AFsAXQBcALQAYABA-', utf7.encodeAll('!"§$%&/()=?\'*+#-_.:,;<>|[]\\´`@'));
  assert.equal('+ACEAIgCnACQAJQAm-/()+AD0-?\'+ACoAKwAj--+AF8-.:,+ADsAPAA+AHwAWwBdAFwAtABgAEA-', utf7.encode('!"§$%&/()=?\'*+#-_.:,;<>|[]\\´`@'));
});

test('test conversion from utf7 to utf8', function(assert) {
  assert.plan(32);

  // Examples from RFC 2152.
  assert.equal('A\u2262\u0391.', utf7.decode('A+ImIDkQ-.'));
  assert.equal('A\u2262\u0391.', utf7.decode('A+ImIDkQ.'));
  assert.equal('A\u2262\u0391.', utf7.decode('+AEEiYgORAC4-'));
  assert.equal('A\u2262\u0391.', utf7.decode('+AEEiYgORAC4'));

  assert.equal('\u65E5\u672C\u8A9E', utf7.decode('+ZeVnLIqe-'));
  assert.equal('\u65E5\u672C\u8A9E', utf7.decode('+ZeVnLIqe'));

  assert.equal('Hi Mom -\u263A-!', utf7.decode('Hi Mom -+Jjo--!'));
  assert.equal('Hi Mom -\u263A-!', utf7.decode('Hi+ACA-Mom+ACA--+Jjo--+ACE-'));
  assert.equal('Item 3 is \u00A31.', utf7.decode('Item 3 is +AKM-1.'));
  assert.equal('Item 3 is \u00A31.', utf7.decode('Item+ACA-3+ACA-is+ACAAow-1.'));
  assert.equal('Hi Mom -\u263A-!', utf7.decode('+AEgAaQAgAE0AbwBtACAALSY6AC0AIQ-'));
  assert.equal('Hi Mom -\u263A-!', utf7.decode('+AEgAaQAgAE0AbwBtACAALSY6AC0AIQ'));

  // Custom examples that contain more than one mode shift.
  assert.equal('Jyv\u00E4skyl\u00E4', utf7.decode('Jyv+AOQ-skyl+AOQ-'));
  assert.equal('Jyv\u00E4skyl\u00E4', utf7.decode('Jyv+AOQ-skyl+AOQ'));
  assert.equal('\'\u4F60\u597D\' heißt "Hallo"', utf7.decode('\'+T2BZfQ-\' hei+AN8-t "Hallo"'));
  assert.equal('\'\u4F60\u597D\' heißt "Hallo"', utf7.decode('\'+T2BZfQ\' hei+AN8-t "Hallo"'));
  assert.equal('\'\u4F60\u597D\' heißt "Hallo"', utf7.decode('\'+T2BZfQ-\'+ACA-hei+AN8-t+ACAAIg-Hallo+ACI-'));
  assert.equal('\'\u4F60\u597D\' heißt "Hallo"', utf7.decode('\'+T2BZfQ-\'+ACA-hei+AN8-t+ACAAIg-Hallo+ACI'));
  assert.equal('\'\u4F60\u597D\' heißt "Hallo"', utf7.decode('+ACdPYFl9ACcAIABoAGUAaQDfAHQAIAAiAEgAYQBsAGwAbwAi-'));
  assert.equal('\'\u4F60\u597D\' heißt "Hallo"', utf7.decode('+ACdPYFl9ACcAIABoAGUAaQDfAHQAIAAiAEgAYQBsAGwAbwAi'));

  // The plus sign is represented by +-.
  assert.equal('Hot + Spicy + Fruity', utf7.decode('Hot +- Spicy +- Fruity'));
  assert.equal('Hot + Spicy + Fruity', utf7.decode('Hot+ACAAKwAg-Spicy+ACAAKwAg-Fruity'));
  assert.equal('Hot + Spicy + Fruity', utf7.decode('+AEgAbwB0ACAAKwAgAFMAcABpAGMAeQAgACsAIABGAHIAdQBpAHQAeQ-'));
  assert.equal('Hot + Spicy + Fruity', utf7.decode('+AEgAbwB0ACAAKwAgAFMAcABpAGMAeQAgACsAIABGAHIAdQBpAHQAeQ'));


  // Slashes in the beginning.
  assert.equal('\uffff\uedca\u9876\u5432\u1fed', utf7.decode('+///typh2VDIf7Q-'));
  assert.equal('\uffff\uedca\u9876\u5432\u1fed', utf7.decode('+///typh2VDIf7Q'));

  // + sign around non-ASCII chars
  assert.equal('\u00E4+\u00E4+\u00E4', utf7.decode('+AOQ-+-+AOQ-+-+AOQ-'));
  assert.equal('\u00E4+\u00E4+\u00E4', utf7.decode('+AOQ++AOQ+-+AOQ'));
  assert.equal('\u00E4+\u00E4+\u00E4', utf7.decode('+AOQAKwDkACsA5A-'));
  assert.equal('\u00E4+\u00E4+\u00E4', utf7.decode('+AOQAKwDkACsA5A'));

  // Some special characters (e.g. plus sign)
  assert.equal('!"§$%&/()=?*+#-_.:,;<>|[]\\´`@', utf7.decode('+ACEAIgCnACQAJQAmAC8AKAApAD0APwAqACsAIwAtAF8ALgA6ACwAOwA8AD4AfABbAF0AXAC0AGAAQA-'));
  assert.equal('!"§$%&/()=?*+#-_.:,;<>|[]\\´`@', utf7.decode('+ACEAIgCnACQAJQAmAC8AKAApAD0APwAqACsAIwAtAF8ALgA6ACwAOwA8AD4AfABbAF0AXAC0AGAAQA'));
});
