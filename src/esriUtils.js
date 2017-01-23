/* global L:false */
import 'whatwg-fetch'
import { Tools } from 'terraformer'
//const cors = ((window.XMLHttpRequest && 'withCredentials' in new window.XMLHttpRequest()));
const pointerEvents = document.documentElement.style.pointerEvents === '';
const tileProtocol = (window.location.protocol !== 'https:') ? 'http:' : 'https:'
export const basemaps = {
    ATTRIBUTIONPREFIX: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>',
    TILES: {
      Streets: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 19,
          subdomains: ['server', 'services'],
          attribution: 'USGS, NOAA',
          attributionUrl: 'https://static.arcgis.com/attribution/World_Street_Map'
        }
      },
      Topographic: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 19,
          subdomains: ['server', 'services'],
          attribution: 'USGS, NOAA',
          attributionUrl: 'https://static.arcgis.com/attribution/World_Topo_Map',
          cachedAttributionData: require('./caches/esriTopographicBasemapAttributions.js')
        }
      },
      Oceans: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          attribution: 'USGS, NOAA',
          attributionUrl: 'https://static.arcgis.com/attribution/Ocean_Basemap'
        }
      },
      OceansLabels: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane'
        }
      },
      NationalGeographic: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          attribution: 'National Geographic, DeLorme, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, increment P Corp.'
        }
      },
      DarkGray: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          attribution: 'HERE, DeLorme, MapmyIndia, &copy; OpenStreetMap contributors'
        }
      },
      DarkGrayLabels: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane',
          attribution: ''

        }
      },
      Gray: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          attribution: 'HERE, DeLorme, MapmyIndia, &copy; OpenStreetMap contributors'
        }
      },
      GrayLabels: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane',
          attribution: ''
        }
      },
      Imagery: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 19,
          subdomains: ['server', 'services'],
          attribution: 'DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community'
        }
      },
      ImageryLabels: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 19,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane',
          attribution: ''
        }
      },
      ImageryTransportation: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 19,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane'
        }
      },
      ShadedRelief: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 13,
          subdomains: ['server', 'services'],
          attribution: 'USGS'
        }
      },
      ShadedReliefLabels: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 12,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane',
          attribution: ''
        }
      },
      Terrain: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 13,
          subdomains: ['server', 'services'],
          attribution: 'USGS, NOAA'
        }
      },
      TerrainLabels: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 13,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane',
          attribution: ''
        }
      },
      USATopo: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 15,
          subdomains: ['server', 'services'],
          attribution: 'USGS, National Geographic Society, i-cubed'
        }
      }
    }
  }
const _basemapKeys = {}
export const basemapKeysArray = []
for (const tile in basemaps.TILES) {
  if ({}.hasOwnProperty.call(basemaps.TILES, tile)) {
    basemapKeysArray.push(tile)
    _basemapKeys[tile] = tile
  }
}
export const basemapKeys = Object.freeze(_basemapKeys)
export function calcAttributionWidth (map) {
  // the extra 160 pixels are for the prefix attribution and ellipsis
  return (map.getSize().x - 160) + 'px';
}
export function getAttributionData (url, map) {
  fetch(url)
  .then(res => res.json())
  .then(L.Util.bind(function(attributions, error) {
  //jsonp(url, {}, L.Util.bind(function (error, attributions) {
    if (error) { return; }
    map._esriAttributions = [];
    for (var c = 0; c < attributions.contributors.length; c++) {
      var contributor = attributions.contributors[c];

      for (var i = 0; i < contributor.coverageAreas.length; i++) {
        var coverageArea = contributor.coverageAreas[i];
        var southWest = L.latLng(coverageArea.bbox[0], coverageArea.bbox[1]);
        var northEast = L.latLng(coverageArea.bbox[2], coverageArea.bbox[3]);
        map._esriAttributions.push({
          attribution: contributor.attribution,
          score: coverageArea.score,
          bounds: L.latLngBounds(southWest, northEast),
          minZoom: coverageArea.zoomMin,
          maxZoom: coverageArea.zoomMax
        });
      }
    }

    map._esriAttributions.sort(function (a, b) {
      return b.score - a.score;
    });

    // pass the same argument as the map's 'moveend' event
    var obj = { target: map };
    updateMapAttribution(obj);
  }, this));
}
export function updateMapAttribution (evt) {
  var map = evt.target;
  var oldAttributions = map._esriAttributions || [];

  if (map && map.attributionControl && oldAttributions) {
    var newAttributions = '';
    var bounds = map.getBounds();
    var wrappedBounds = L.latLngBounds(
      bounds.getSouthWest().wrap(),
      bounds.getNorthEast().wrap()
    );
    var zoom = map.getZoom();
    for (var i = 0; i < oldAttributions.length; i++) {
      var attribution = oldAttributions[i];
      var text = attribution.attribution;

      if (!newAttributions.match(text) && attribution.bounds.intersects(wrappedBounds) && zoom >= attribution.minZoom && zoom <= attribution.maxZoom) {
        newAttributions += (', ' + text);
      }
    }
    newAttributions = newAttributions.substr(2);
    var attributionElement = map.attributionControl._container.querySelector('.esri-attributions');

    attributionElement.innerHTML = newAttributions;
    attributionElement.style.maxWidth = calcAttributionWidth(map);

    map.fire('attributionupdated', {
      attribution: newAttributions
    });
  }
}
export function attributes(url) {
  
}
export function leafletBoundingBoxToEsriEnvelopeString(bbox) {
  return `${bbox._southWest.lng},${bbox._southWest.lat},${bbox._northEast.lng},${bbox._northEast.lat}`
}
export function sr3857To4326(coordinate) {
  if (Array.isArray(coordinate)) {
    const x = Tools.positionToGeographic(coordinate)
    return {lng:x[0], lat:x[1]}
  }
}
