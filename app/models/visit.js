import DS from 'ember-data';

export default DS.Model.extend({
  host: DS.attr('string', { defaultValue: 'none' }),
  visited_at: DS.attr('date'),
  duration: DS.attr('number'),
  active: DS.attr('boolean')
});
