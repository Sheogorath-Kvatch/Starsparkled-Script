// ==UserScript==
// @name         Starsparkled Night City Skin
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace town map and building-list images
// @match        *://*.illyriad.co.uk/*
// @match        *://elgea.illyriad.co.uk/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const BUILDING_SIZE = 50;
    const BUILDING_OFFSET = (75 - BUILDING_SIZE) / 2;
    const BUILDING_ART = '';
    const CASTLE = '';

    const DEFAULT_BRIGHTNESS = 0.9;
    const DEFAULT_HUE = 30;
    const DEFAULT_SATURATION = 0.7;

    const SIZE_OVERRIDES = {
        '03-cottage_off.png': 80
    };

    const BRIGHTNESS_OVERRIDES = {
        'back.jpg': 1.1,
        'lumberwood.png': 1.2,
        '03-squarebushes.png': 1.1
    };

    const HUE_OVERRIDES = {
        'back.jpg': 0,
        'lumberwood.png': 0,
        '03-squarebushes.png': 0
    };

    const SATURATION_OVERRIDES = {
        'back.jpg': 1.1,
        'lumberwood.png': 1.0,
        '03-squarebushes.png': 1.1
    };

    let mapOn = GM_getValue('mapOn', true);
    let buildingsOn = GM_getValue('buildingsOn', true);

    const MAP_ONLY = {
        'back.jpg':                  'https://raw.githubusercontent.com/Sheogorath-Kvatch/Sheo-Script/refs/heads/main/Images/twinkle%20back.gif',
        '03-roads.png':              '',
        '03-squarebushes.png':       'https://raw.githubusercontent.com/Sheogorath-Kvatch/Sheo-Script/refs/heads/main/Images/square%20night%20bushes.png',
        '03-fountain.png':           '',
        '03-wall_upper.png':         '',
        '03-wall_lower.png':         '',
        'lumberwood.png':            'https://raw.githubusercontent.com/Sheogorath-Kvatch/Sheo-Script/refs/heads/main/Images/night%20trees.png',
        '03-castle_off.png':         CASTLE,
        '03-lumberjack_off.png':     '',
        '03-claypit_off.png':        '',
        '03-ironmine_right_off.png': '',
        '03-ironmine_left_off.png':  '',
        '03-quarry_right_off.png':   '',
        '03-quarry_left_off.png':    '',
        '03-farm_1_off.png':         '',
        '03-farm_2_off.png':         '',
        '03-farm_3_off.png':         '',
        '03-farm_4_off.png':         '',
        '03-farm_5_off.png':         '',
        '03-farm_6_off.png':         '',
        '03-farm_7_off.png':         '',
        '03-farm_5_c_off.png':       '',
        'build.gif':                 'https://64.media.tumblr.com/7204639a1101e07c4c7e44bf0a7e92c4/tumblr_mpfa8r3tzF1s5jjtzo1_500.gif'
    };

    const BUILDINGS = {
        '03-barracks_off.png':             BUILDING_ART,
        '03-warehouse_off.png':            BUILDING_ART,
        '03-flourmill_off.png':            BUILDING_ART,
        '03-library_off.png':              BUILDING_ART,
        '03-storehouse_off.png':           BUILDING_ART,
        '03-marketplace_off.png':          BUILDING_ART,
        '03-paddock_off.png':              BUILDING_ART,
        '03-magetower_off.png':            BUILDING_ART,
        '03-commonground_off.png':         BUILDING_ART,
        '03-saddlemaker_off.png':          BUILDING_ART,
        '03-consulate_off.png':            BUILDING_ART,
        '03-fletcher_off.png':             BUILDING_ART,
        '03-blacksmith_off.png':           BUILDING_ART,
        '03-forge_off.png':                BUILDING_ART,
        '03-spearmaker_off.png':           BUILDING_ART,
        '03-tanner_off.png':               BUILDING_ART,
        '03-farmyard_off.png':             BUILDING_ART,
        '03-skinnersguild_off.png':        BUILDING_ART,
        '03-archersfield_off.png':         BUILDING_ART,
        '03-architectsoffice_off.png':     BUILDING_ART,
        '03-arcticwarfarecollege_off.png': BUILDING_ART,
        '03-assassinsabode_off.png':       BUILDING_ART,
        '03-bookbinder_off.png':           BUILDING_ART,
        '03-bowyer_off.png':               BUILDING_ART,
        '03-brewery_off.png':              BUILDING_ART,
        '03-carpenter_off.png':            BUILDING_ART,
        '03-cavalryparadeground_off.png':  BUILDING_ART,
        '03-chainsmith_off.png':           BUILDING_ART,
        '03-chanceryofestates_off.png':    BUILDING_ART,
        '03-cottage_off.png':              'https://raw.githubusercontent.com/Sheogorath-Kvatch/Sheo-Script/refs/heads/main/Perfected%201/cottage%20full%20of%20bears.png',
        '03-desertwarfarecollege_off.png': BUILDING_ART,
        '03-emptytownplotbuildlist_off.png': '',
        '03-foreignoffice_off.png':        BUILDING_ART,
        '03-foundry_off.png':              BUILDING_ART,
        '03-geomancersretreat_off.png':    BUILDING_ART,
        '03-herbalist_off.png':            BUILDING_ART,
        '03-horsetrainer2_off.png':        BUILDING_ART,
        '03-infantryquarters_off.png':     BUILDING_ART,
        '03-junglewarfarecollege_off.png': BUILDING_ART,
        '03-kiln_off.png':                 BUILDING_ART,
        '03-leathersmith_off.png':         BUILDING_ART,
        '03-merchantsguild_off.png':       BUILDING_ART,
        '03-miner_off.png':                BUILDING_ART,
        '03-platesmith_off.png':           BUILDING_ART,
        '03-runmastersgrounding_off.png':  BUILDING_ART,
        '03-saboteurssanctuary_off.png':   BUILDING_ART,
        '03-scoutslookout_off.png':        BUILDING_ART,
        '03-siegeworkshop_off.png':        BUILDING_ART,
        '03-spearmensbillets_off.png':     BUILDING_ART,
        '03-spearsmith_off.png':           BUILDING_ART,
        '03-spieshidout_off.png':          BUILDING_ART,
        '03-stonemason_off.png':           BUILDING_ART,
        '03-swordsmith_off.png':           BUILDING_ART,
        '03-taverna_off.png':              BUILDING_ART,
        '03-thievesden_off.png':           BUILDING_ART,
        '03-tradeoffice_off.png':          BUILDING_ART,
        '03-trapper_off.png':              BUILDING_ART,
        '03-vault_off.png':                BUILDING_ART
    };

    const mapPairs = Object.entries(MAP_ONLY).filter(([, url]) => url);
    const buildingPairs = Object.entries(BUILDINGS).filter(([, url]) => url);

    function getSrc(img) {
        return img.dataset.originalSrc || img.getAttribute('src') || img.src || '';
    }

    function getOverride(map, src, fallback) {
        for (const [needle, value] of Object.entries(map)) {
            if (src.includes(needle)) return value;
        }
        return fallback;
    }

    function applyFilters(img) {
        const src = getSrc(img);
        const brightness = getOverride(BRIGHTNESS_OVERRIDES, src, DEFAULT_BRIGHTNESS);
        const hue = getOverride(HUE_OVERRIDES, src, DEFAULT_HUE);
        const saturation = getOverride(SATURATION_OVERRIDES, src, DEFAULT_SATURATION);

        const filters = ['brightness(' + brightness + ')'];
        if (saturation !== 1) filters.push('saturate(' + saturation + ')');
        if (hue) filters.push('hue-rotate(' + hue + 'deg)');
        img.style.filter = filters.join(' ');
    }

    function applyFiltersToAll() {
        document.querySelectorAll('#townMap img').forEach(applyFilters);
    }

    function addCityOverlay() {
        const map = document.querySelector('#townMap');
        if (!map || document.getElementById('city-overlay')) return;

        const overlay = document.createElement('img');
        overlay.id = 'city-overlay';
        overlay.src = 'https://raw.githubusercontent.com/Sheogorath-Kvatch/Sheo-Script/refs/heads/main/Images/fireflies%20ultra.gif';
        overlay.style.position = 'absolute';
        overlay.style.left = '0';
        overlay.style.top = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '50';
        overlay.style.objectFit = 'cover';
        map.appendChild(overlay);
    }

    function removeCityOverlay() {
        const existing = document.getElementById('city-overlay');
        if (existing) existing.remove();
    }

    function shrinkBuilding(img, needle) {
        if (!needle.includes('_off.png')) return;
        if (needle.includes('wall_') || needle.includes('castle') || needle.includes('farm_')) return;

        const size = SIZE_OVERRIDES[needle] || BUILDING_SIZE;
        const offset = (75 - size) / 2;

        img.style.width = size + 'px';
        img.style.height = size + 'px';
        img.style.objectFit = 'contain';
        img.style.marginLeft = offset + 'px';
        img.style.marginTop = offset + 'px';
    }

    function clearShrink(img) {
        img.style.width = '';
        img.style.height = '';
        img.style.objectFit = '';
        img.style.marginLeft = '';
        img.style.marginTop = '';
    }

    function restore(img, tag) {
        if (img.dataset.skinTag !== tag) return;
        if (img.dataset.originalSrc) img.src = img.dataset.originalSrc;
        delete img.dataset.skinned;
        delete img.dataset.skinTag;
        delete img.dataset.originalSrc;
        clearShrink(img);
        img.style.filter = '';
    }

    function sizeBuildGif(img) {
        const size = 60;
        const original = 75;
        const offset = (original - size) / 2;
        img.style.width = size + 'px';
        img.style.height = size + 'px';
        img.style.objectFit = 'contain';
        img.style.marginLeft = (offset - 1) + 'px';
        img.style.marginTop = (offset - 25) + 'px';
    }

    function swap(img, pairs, tag, allowShrink) {
        if (img.dataset.skinned && img.dataset.skinTag === tag) return;
        const src = img.dataset.originalSrc || img.getAttribute('src') || '';
        if (!src) return;
        for (const [needle, url] of pairs) {
            if (src.includes(needle)) {
                if (!img.dataset.originalSrc) img.dataset.originalSrc = img.getAttribute('src') || src;
                img.src = url;
                img.dataset.skinned = '1';
                img.dataset.skinTag = tag;
                if (needle === 'build.gif') {
                    sizeBuildGif(img);
                } else if (allowShrink) {
                    shrinkBuilding(img, needle);
                }
                return;
            }
        }
    }

    function capKeepCastle() {
        if (!mapOn || !CASTLE) return;
        document.querySelectorAll('img').forEach(img => {
            if (img.closest('#townMap')) return;
            const src = img.dataset.originalSrc || img.getAttribute('src') || img.src || '';
            if (!src.includes('03-castle_off.png')) return;
            if (img.dataset.skinTag !== 'map') {
                img.dataset.originalSrc = img.getAttribute('src') || src;
                img.src = CASTLE;
                img.dataset.skinned = '1';
                img.dataset.skinTag = 'map';
            }
            img.style.setProperty('width', '251px', 'important');
            img.style.setProperty('height', '169px', 'important');
            img.style.setProperty('max-width', '251px', 'important');
            img.style.setProperty('max-height', '169px', 'important');
            img.style.objectFit = 'contain';
        });
    }

    function apply() {
        document.querySelectorAll('img').forEach(img => {
            if (!mapOn && img.dataset.skinTag === 'map') restore(img, 'map');
            if (!buildingsOn && img.dataset.skinTag === 'building') restore(img, 'building');
        });
        if (!mapOn) removeCityOverlay();

        if (mapOn) {
            document.querySelectorAll('#townMap img, img').forEach(img => swap(img, mapPairs, 'map', false));
            capKeepCastle();
            addCityOverlay();
        }
        if (buildingsOn) {
            document.querySelectorAll('img').forEach(img => swap(img, buildingPairs, 'building', true));
        }
        if (mapOn || buildingsOn) {
            applyFiltersToAll();
        }
    }


    apply();
    new MutationObserver(apply).observe(document.body, { childList: true, subtree: true });
    console.log('Town skin loaded. Map:', mapOn, 'Buildings:', buildingsOn);
})();
