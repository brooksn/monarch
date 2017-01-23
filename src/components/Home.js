import React from 'react'
//import BannerMap from './BannerMap.js'
import OLBannerMap from './OLBannerMap.js'
import BannerMapTable from './BannerMapTable.js'
//import { basemapKeys } from '../esri-utils.js'
import '../resources/openlayers/ol_v3.18.2.css'

export default () => 
  <div className="home">
    <OLBannerMap mapName="olBannerMap" />
    <BannerMapTable mapName="olBannerMap" />
  </div>
