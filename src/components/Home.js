import React from 'react'
import BannerMap from './BannerMap.js'
import BannerMapTable from './BannerMapTable.js'
import { basemapKeys } from '../esri-utils.js'
export default () => 
  <div className="home">
    <BannerMap mapName="bannermap" basemapStyle={basemapKeys.Topographic} />
    <BannerMapTable mapName="bannermap" />
  </div>
