/* global it expect inject beforeEach describe */
/* jshint unused:false*/

(function() {
  'use strict';

  describe('GraphService', function() {
    var $httpBackend;
    var graph;
    var result;
    var GraphService;
    beforeEach(module('microServicesGui'));

    beforeEach(inject(function(_$httpBackend_, _GraphService_) {
      $httpBackend = _$httpBackend_;
      GraphService = _GraphService_;
    }));

    function givenGraph() {
      graph = [{
        name: 'Top Level',
        parent: 'null'
      }];
    }
    function whenGetGraphCalled() {
      result = GraphService.getGraph().then(function(value) {
        result = value;
      }, function(error) {
        result = error;
      });
      $httpBackend.flush();
    }
    function givenBackendReturnsError() {
      $httpBackend
        .expectGET('/dependencies/graph')
        .respond(function() {
          return [404];
        });
    }
    function thenExpectResultToBeGraph() {
      expect(result.status).toEqual(200);
      expect(result.data).toEqual(graph);
    }
    function thenExpectResultToBeEmpty() {
      expect(result.status).toEqual(404);
      expect(result.data).toBeUndefined();
    }
    function givenBackendReturnsGraph() {
      $httpBackend
        .expectGET('/dependencies/graph')
        .respond(function() {
          return [200, graph];
        });
    }

    it('Should call graph rest service', function() {
      givenGraph();
      givenBackendReturnsGraph();
      whenGetGraphCalled();
      thenExpectResultToBeGraph();
    });

    it('Should not call graph rest service', function() {
      givenGraph();
      givenBackendReturnsError();
      whenGetGraphCalled();
      thenExpectResultToBeEmpty();
    });
  });
})();
