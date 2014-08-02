/**
 * @name InfoBox
 * @version 1.1.12 [December 11, 2012]
 * @author Gary Little (inspired by proof-of-concept code from Pamela Fox of Google)
 * @copyright Copyright 2010 Gary Little [gary at luxcentral.com]
 * @fileoverview InfoBox extends the Google Maps JavaScript API V3 <tt>OverlayView</tt> class.
 *  <p>
 *  An InfoBox behaves like a <tt>google.maps.InfoWindow</tt>, but it supports several
 *  additional properties for advanced styling. An InfoBox can also be used as a map label.
 *  <p>
 *  An InfoBox also fires the same events as a <tt>google.maps.InfoWindow</tt>.
 */

/*!
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jslint browser:true */
/*global google */

/**
 * @name InfoBoxOptions
 * @class This class represents the optional parameter passed to the {@link InfoBox} constructor.
 * @property {string|Node} content The content of the InfoBox (plain text or an HTML DOM node).
 * @property {boolean} [disableAutoPan=false] Disable auto-pan on <tt>open</tt>.
 * @property {number} maxWidth The maximum width (in pixels) of the InfoBox. Set to 0 if no maximum.
 * @property {Size} pixelOffset The offset (in pixels) from the top left corner of the InfoBox
 *  (or the bottom left corner if the <code>alignBottom</code> property is <code>true</code>)
 *  to the map pixel corresponding to <tt>position</tt>.
 * @property {LatLng} position The geographic location at which to display the InfoBox.
 * @property {number} zIndex The CSS z-index style value for the InfoBox.
 *  Note: This value overrides a zIndex setting specified in the <tt>boxStyle</tt> property.
 * @property {string} [boxClass="infoBox"] The name of the CSS class defining the styles for the InfoBox container.
 * @property {Object} [boxStyle] An object literal whose properties define specific CSS
 *  style values to be applied to the InfoBox. Style values defined here override those that may
 *  be defined in the <code>boxClass</code> style sheet. If this property is changed after the
 *  InfoBox has been created, all previously set styles (except those defined in the style sheet)
 *  are removed from the InfoBox before the new style values are applied.
 * @property {string} closeBoxMargin The CSS margin style value for the close box.
 *  The default is "2px" (a 2-pixel margin on all sides).
 * @property {string} closeBoxURL The URL of the image representing the close box.
 *  Note: The default is the URL for Google's standard close box.
 *  Set this property to "" if no close box is required.
 * @property {Size} infoBoxClearance Minimum offset (in pixels) from the InfoBox to the
 *  map edge after an auto-pan.
 * @property {boolean} [isHidden=false] Hide the InfoBox on <tt>open</tt>.
 *  [Deprecated in favor of the <tt>visible</tt> property.]
 * @property {boolean} [visible=true] Show the InfoBox on <tt>open</tt>.
 * @property {boolean} alignBottom Align the bottom left corner of the InfoBox to the <code>position</code>
 *  location (default is <tt>false</tt> which means that the top left corner of the InfoBox is aligned).
 * @property {string} pane The pane where the InfoBox is to appear (default is "floatPane").
 *  Set the pane to "mapPane" if the InfoBox is being used as a map label.
 *  Valid pane names are the property names for the <tt>google.maps.MapPanes</tt> object.
 * @property {boolean} enableEventPropagation Propagate mousedown, mousemove, mouseover, mouseout,
 *  mouseup, click, dblclick, touchstart, touchend, touchmove, and contextmenu events in the InfoBox
 *  (default is <tt>false</tt> to mimic the behavior of a <tt>google.maps.InfoWindow</tt>). Set
 *  this property to <tt>true</tt> if the InfoBox is being used as a map label.
 */

/**
 * Creates an InfoBox with the options specified in {@link InfoBoxOptions}.
 *  Call <tt>InfoBox.open</tt> to add the box to the map.
 * @constructor
 * @param {InfoBoxOptions} [opt_opts]
 */
function InfoBox(opt_opts) {

    opt_opts = opt_opts || {};

    google.maps.OverlayView.apply(this, arguments);

    // Standard options (in common with google.maps.InfoWindow):
    //
    this.content_ = opt_opts.content || "";
    this.disableAutoPan_ = opt_opts.disableAutoPan || false;
    this.maxWidth_ = opt_opts.maxWidth || 0;
    this.pixelOffset_ = opt_opts.pixelOffset || new google.maps.Size(0, 0);
    this.position_ = opt_opts.position || new google.maps.LatLng(0, 0);
    this.zIndex_ = opt_opts.zIndex || null;

    // Additional options (unique to InfoBox):
    //
    this.boxClass_ = opt_opts.boxClass || "infoBox";
    this.boxStyle_ = opt_opts.boxStyle || {};
    this.closeBoxMargin_ = opt_opts.closeBoxMargin || "2px";
    this.closeBoxURL_ = opt_opts.closeBoxURL || "http://www.google.com/intl/en_us/mapfiles/close.gif";
    if (opt_opts.closeBoxURL === "") {
        this.closeBoxURL_ = "";
    }
    this.infoBoxClearance_ = opt_opts.infoBoxClearance || new google.maps.Size(1, 1);

    if (typeof opt_opts.visible === "undefined") {
        if (typeof opt_opts.isHidden === "undefined") {
            opt_opts.visible = true;
        } else {
            opt_opts.visible = !opt_opts.isHidden;
        }
    }
    this.isHidden_ = !opt_opts.visible;

    this.alignBottom_ = opt_opts.alignBottom || false;
    this.pane_ = opt_opts.pane || "floatPane";
    this.enableEventPropagation_ = opt_opts.enableEventPropagation || false;

    this.div_ = null;
    this.closeListener_ = null;
    this.moveListener_ = null;
    this.contextListener_ = null;
    this.eventListeners_ = null;
    this.fixedWidthSet_ = null;
}

/* InfoBox extends OverlayView in the Google Maps API v3.
 */
InfoBox.prototype = new google.maps.OverlayView();

/**
 * Creates the DIV representing the InfoBox.
 * @private
 */
InfoBox.prototype.createInfoBoxDiv_ = function () {

    var i;
    var events;
    var bw;
    var me = this;

    // This handler prevents an event in the InfoBox from being passed on to the map.
    //
    var cancelHandler = function (e) {
        e.cancelBubble = true;
        if (e.stopPropagation) {
            e.stopPropagation();
        }
    };

    // This handler ignores the current event in the InfoBox and conditionally prevents
    // the event from being passed on to the map. It is used for the contextmenu event.
    //
    var ignoreHandler = function (e) {

        e.returnValue = false;

        if (e.preventDefault) {

            e.preventDefault();
        }

        if (!me.enableEventPropagation_) {

            cancelHandler(e);
        }
    };

    if (!this.div_) {

        this.div_ = document.createElement("div");

        this.setBoxStyle_();

        if (typeof this.content_.nodeType === "undefined") {
            this.div_.innerHTML = this.getCloseBoxImg_() + this.content_;
        } else {
            this.div_.innerHTML = this.getCloseBoxImg_();
            this.div_.appendChild(this.content_);
        }

        // Add the InfoBox DIV to the DOM
        this.getPanes()[this.pane_].appendChild(this.div_);

        this.addClickHandler_();

        if (this.div_.style.width) {

            this.fixedWidthSet_ = true;

        } else {

            if (this.maxWidth_ !== 0 && this.div_.offsetWidth > this.maxWidth_) {

                this.div_.style.width = this.maxWidth_;
                this.div_.style.overflow = "auto";
                this.fixedWidthSet_ = true;

            } else { // The following code is needed to overcome problems with MSIE

                bw = this.getBoxWidths_();

                this.div_.style.width = (this.div_.offsetWidth - bw.left - bw.right) + "px";
                this.fixedWidthSet_ = false;
            }
        }

        this.panBox_(this.disableAutoPan_);

        if (!this.enableEventPropagation_) {

            this.eventListeners_ = [];

            // Cancel event propagation.
            //
            // Note: mousemove not included (to resolve Issue 152)
            events = ["mousedown", "mouseover", "mouseout", "mouseup",
                "click", "dblclick", "touchstart", "touchend", "touchmove"];

            for (i = 0; i < events.length; i++) {

                this.eventListeners_.push(google.maps.event.addDomListener(this.div_, events[i], cancelHandler));
            }

            // Workaround for Google bug that causes the cursor to change to a pointer
            // when the mouse moves over a marker underneath InfoBox.
            this.eventListeners_.push(google.maps.event.addDomListener(this.div_, "mouseover", function (e) {
                this.style.cursor = "default";
            }));
        }

        this.contextListener_ = google.maps.event.addDomListener(this.div_, "contextmenu", ignoreHandler);

        /**
         * This event is fired when the DIV containing the InfoBox's content is attached to the DOM.
         * @name InfoBox#domready
         * @event
         */
        google.maps.event.trigger(this, "domready");
    }
};

/**
 * Returns the HTML <IMG> tag for the close box.
 * @private
 */
InfoBox.prototype.getCloseBoxImg_ = function () {

    var img = "";

    if (this.closeBoxURL_ !== "") {

        img  = "<img";
        img += " src='" + this.closeBoxURL_ + "'";
        img += " align=right"; // Do this because Opera chokes on style='float: right;'
        img += " style='";
        img += " position: relative;"; // Required by MSIE
        img += " cursor: pointer;";
        img += " margin: " + this.closeBoxMargin_ + ";";
        img += "'>";
    }

    return img;
};

/**
 * Adds the click handler to the InfoBox close box.
 * @private
 */
InfoBox.prototype.addClickHandler_ = function () {

    var closeBox;

    if (this.closeBoxURL_ !== "") {

        closeBox = this.div_.firstChild;
        this.closeListener_ = google.maps.event.addDomListener(closeBox, "click", this.getCloseClickHandler_());

    } else {

        this.closeListener_ = null;
    }
};

/**
 * Returns the function to call when the user clicks the close box of an InfoBox.
 * @private
 */
InfoBox.prototype.getCloseClickHandler_ = function () {

    var me = this;

    return function (e) {

        // 1.0.3 fix: Always prevent propagation of a close box click to the map:
        e.cancelBubble = true;

        if (e.stopPropagation) {

            e.stopPropagation();
        }

        /**
         * This event is fired when the InfoBox's close box is clicked.
         * @name InfoBox#closeclick
         * @event
         */
        google.maps.event.trigger(me, "closeclick");

        me.close();
    };
};

/**
 * Pans the map so that the InfoBox appears entirely within the map's visible area.
 * @private
 */
InfoBox.prototype.panBox_ = function (disablePan) {

    var map;
    var bounds;
    var xOffset = 0, yOffset = 0;

    if (!disablePan) {

        map = this.getMap();

        if (map instanceof google.maps.Map) { // Only pan if attached to map, not panorama

            if (!map.getBounds().contains(this.position_)) {
                // Marker not in visible area of map, so set center
                // of map to the marker position first.
                map.setCenter(this.position_);
            }

            bounds = map.getBounds();

            var mapDiv = map.getDiv();
            var mapWidth = mapDiv.offsetWidth;
            var mapHeight = mapDiv.offsetHeight;
            var iwOffsetX = this.pixelOffset_.width;
            var iwOffsetY = this.pixelOffset_.height;
            var iwWidth = this.div_.offsetWidth;
            var iwHeight = this.div_.offsetHeight;
            var padX = this.infoBoxClearance_.width;
            var padY = this.infoBoxClearance_.height;
            var pixPosition = this.getProjection().fromLatLngToContainerPixel(this.position_);

            if (pixPosition.x < (-iwOffsetX + padX)) {
                xOffset = pixPosition.x + iwOffsetX - padX;
            } else if ((pixPosition.x + iwWidth + iwOffsetX + padX) > mapWidth) {
                xOffset = pixPosition.x + iwWidth + iwOffsetX + padX - mapWidth;
            }
            if (this.alignBottom_) {
                if (pixPosition.y < (-iwOffsetY + padY + iwHeight)) {
                    yOffset = pixPosition.y + iwOffsetY - padY - iwHeight;
                } else if ((pixPosition.y + iwOffsetY + padY) > mapHeight) {
                    yOffset = pixPosition.y + iwOffsetY + padY - mapHeight;
                }
            } else {
                if (pixPosition.y < (-iwOffsetY + padY)) {
                    yOffset = pixPosition.y + iwOffsetY - padY;
                } else if ((pixPosition.y + iwHeight + iwOffsetY + padY) > mapHeight) {
                    yOffset = pixPosition.y + iwHeight + iwOffsetY + padY - mapHeight;
                }
            }

            if (!(xOffset === 0 && yOffset === 0)) {

                // Move the map to the shifted center.
                //
                var c = map.getCenter();
                map.panBy(xOffset, yOffset);
            }
        }
    }
};

/**
 * Sets the style of the InfoBox by setting the style sheet and applying
 * other specific styles requested.
 * @private
 */
InfoBox.prototype.setBoxStyle_ = function () {

    var i, boxStyle;

    if (this.div_) {

        // Apply style values from the style sheet defined in the boxClass parameter:
        this.div_.className = this.boxClass_;

        // Clear existing inline style values:
        this.div_.style.cssText = "";

        // Apply style values defined in the boxStyle parameter:
        boxStyle = this.boxStyle_;
        for (i in boxStyle) {

            if (boxStyle.hasOwnProperty(i)) {

                this.div_.style[i] = boxStyle[i];
            }
        }

        // Fix up opacity style for benefit of MSIE:
        //
        if (typeof this.div_.style.opacity !== "undefined" && this.div_.style.opacity !== "") {

            this.div_.style.filter = "alpha(opacity=" + (this.div_.style.opacity * 100) + ")";
        }

        // Apply required styles:
        //
        this.div_.style.position = "absolute";
        this.div_.style.visibility = 'hidden';
        if (this.zIndex_ !== null) {

            this.div_.style.zIndex = this.zIndex_;
        }
    }
};

/**
 * Get the widths of the borders of the InfoBox.
 * @private
 * @return {Object} widths object (top, bottom left, right)
 */
InfoBox.prototype.getBoxWidths_ = function () {

    var computedStyle;
    var bw = {top: 0, bottom: 0, left: 0, right: 0};
    var box = this.div_;

    if (document.defaultView && document.defaultView.getComputedStyle) {

        computedStyle = box.ownerDocument.defaultView.getComputedStyle(box, "");

        if (computedStyle) {

            // The computed styles are always in pixel units (good!)
            bw.top = parseInt(computedStyle.borderTopWidth, 10) || 0;
            bw.bottom = parseInt(computedStyle.borderBottomWidth, 10) || 0;
            bw.left = parseInt(computedStyle.borderLeftWidth, 10) || 0;
            bw.right = parseInt(computedStyle.borderRightWidth, 10) || 0;
        }

    } else if (document.documentElement.currentStyle) { // MSIE

        if (box.currentStyle) {

            // The current styles may not be in pixel units, but assume they are (bad!)
            bw.top = parseInt(box.currentStyle.borderTopWidth, 10) || 0;
            bw.bottom = parseInt(box.currentStyle.borderBottomWidth, 10) || 0;
            bw.left = parseInt(box.currentStyle.borderLeftWidth, 10) || 0;
            bw.right = parseInt(box.currentStyle.borderRightWidth, 10) || 0;
        }
    }

    return bw;
};

/**
 * Invoked when <tt>close</tt> is called. Do not call it directly.
 */
InfoBox.prototype.onRemove = function () {

    if (this.div_) {

        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    }
};

/**
 * Draws the InfoBox based on the current map projection and zoom level.
 */
InfoBox.prototype.draw = function () {

    this.createInfoBoxDiv_();

    var pixPosition = this.getProjection().fromLatLngToDivPixel(this.position_);

    this.div_.style.left = (pixPosition.x + this.pixelOffset_.width) + "px";

    if (this.alignBottom_) {
        this.div_.style.bottom = -(pixPosition.y + this.pixelOffset_.height) + "px";
    } else {
        this.div_.style.top = (pixPosition.y + this.pixelOffset_.height) + "px";
    }

    if (this.isHidden_) {

        this.div_.style.visibility = 'hidden';

    } else {

        this.div_.style.visibility = "visible";
    }
};

/**
 * Sets the options for the InfoBox. Note that changes to the <tt>maxWidth</tt>,
 *  <tt>closeBoxMargin</tt>, <tt>closeBoxURL</tt>, and <tt>enableEventPropagation</tt>
 *  properties have no affect until the current InfoBox is <tt>close</tt>d and a new one
 *  is <tt>open</tt>ed.
 * @param {InfoBoxOptions} opt_opts
 */
InfoBox.prototype.setOptions = function (opt_opts) {
    if (typeof opt_opts.boxClass !== "undefined") { // Must be first

        this.boxClass_ = opt_opts.boxClass;
        this.setBoxStyle_();
    }
    if (typeof opt_opts.boxStyle !== "undefined") { // Must be second

        this.boxStyle_ = opt_opts.boxStyle;
        this.setBoxStyle_();
    }
    if (typeof opt_opts.content !== "undefined") {

        this.setContent(opt_opts.content);
    }
    if (typeof opt_opts.disableAutoPan !== "undefined") {

        this.disableAutoPan_ = opt_opts.disableAutoPan;
    }
    if (typeof opt_opts.maxWidth !== "undefined") {

        this.maxWidth_ = opt_opts.maxWidth;
    }
    if (typeof opt_opts.pixelOffset !== "undefined") {

        this.pixelOffset_ = opt_opts.pixelOffset;
    }
    if (typeof opt_opts.alignBottom !== "undefined") {

        this.alignBottom_ = opt_opts.alignBottom;
    }
    if (typeof opt_opts.position !== "undefined") {

        this.setPosition(opt_opts.position);
    }
    if (typeof opt_opts.zIndex !== "undefined") {

        this.setZIndex(opt_opts.zIndex);
    }
    if (typeof opt_opts.closeBoxMargin !== "undefined") {

        this.closeBoxMargin_ = opt_opts.closeBoxMargin;
    }
    if (typeof opt_opts.closeBoxURL !== "undefined") {

        this.closeBoxURL_ = opt_opts.closeBoxURL;
    }
    if (typeof opt_opts.infoBoxClearance !== "undefined") {

        this.infoBoxClearance_ = opt_opts.infoBoxClearance;
    }
    if (typeof opt_opts.isHidden !== "undefined") {

        this.isHidden_ = opt_opts.isHidden;
    }
    if (typeof opt_opts.visible !== "undefined") {

        this.isHidden_ = !opt_opts.visible;
    }
    if (typeof opt_opts.enableEventPropagation !== "undefined") {

        this.enableEventPropagation_ = opt_opts.enableEventPropagation;
    }

    if (this.div_) {

        this.draw();
    }
};

/**
 * Sets the content of the InfoBox.
 *  The content can be plain text or an HTML DOM node.
 * @param {string|Node} content
 */
InfoBox.prototype.setContent = function (content) {
    this.content_ = content;

    if (this.div_) {

        if (this.closeListener_) {

            google.maps.event.removeListener(this.closeListener_);
            this.closeListener_ = null;
        }

        // Odd code required to make things work with MSIE.
        //
        if (!this.fixedWidthSet_) {

            this.div_.style.width = "";
        }

        if (typeof content.nodeType === "undefined") {
            this.div_.innerHTML = this.getCloseBoxImg_() + content;
        } else {
            this.div_.innerHTML = this.getCloseBoxImg_();
            this.div_.appendChild(content);
        }

        // Perverse code required to make things work with MSIE.
        // (Ensures the close box does, in fact, float to the right.)
        //
        if (!this.fixedWidthSet_) {
            this.div_.style.width = this.div_.offsetWidth + "px";
            if (typeof content.nodeType === "undefined") {
                this.div_.innerHTML = this.getCloseBoxImg_() + content;
            } else {
                this.div_.innerHTML = this.getCloseBoxImg_();
                this.div_.appendChild(content);
            }
        }

        this.addClickHandler_();
    }

    /**
     * This event is fired when the content of the InfoBox changes.
     * @name InfoBox#content_changed
     * @event
     */
    google.maps.event.trigger(this, "content_changed");
};

/**
 * Sets the geographic location of the InfoBox.
 * @param {LatLng} latlng
 */
InfoBox.prototype.setPosition = function (latlng) {

    this.position_ = latlng;

    if (this.div_) {

        this.draw();
    }

    /**
     * This event is fired when the position of the InfoBox changes.
     * @name InfoBox#position_changed
     * @event
     */
    google.maps.event.trigger(this, "position_changed");
};

/**
 * Sets the zIndex style for the InfoBox.
 * @param {number} index
 */
InfoBox.prototype.setZIndex = function (index) {

    this.zIndex_ = index;

    if (this.div_) {

        this.div_.style.zIndex = index;
    }

    /**
     * This event is fired when the zIndex of the InfoBox changes.
     * @name InfoBox#zindex_changed
     * @event
     */
    google.maps.event.trigger(this, "zindex_changed");
};

/**
 * Sets the visibility of the InfoBox.
 * @param {boolean} isVisible
 */
InfoBox.prototype.setVisible = function (isVisible) {

    this.isHidden_ = !isVisible;
    if (this.div_) {
        this.div_.style.visibility = (this.isHidden_ ? "hidden" : "visible");
    }
};

/**
 * Returns the content of the InfoBox.
 * @returns {string}
 */
InfoBox.prototype.getContent = function () {

    return this.content_;
};

/**
 * Returns the geographic location of the InfoBox.
 * @returns {LatLng}
 */
InfoBox.prototype.getPosition = function () {

    return this.position_;
};

/**
 * Returns the zIndex for the InfoBox.
 * @returns {number}
 */
InfoBox.prototype.getZIndex = function () {

    return this.zIndex_;
};

/**
 * Returns a flag indicating whether the InfoBox is visible.
 * @returns {boolean}
 */
InfoBox.prototype.getVisible = function () {

    var isVisible;

    if ((typeof this.getMap() === "undefined") || (this.getMap() === null)) {
        isVisible = false;
    } else {
        isVisible = !this.isHidden_;
    }
    return isVisible;
};

/**
 * Shows the InfoBox. [Deprecated; use <tt>setVisible</tt> instead.]
 */
InfoBox.prototype.show = function () {

    this.isHidden_ = false;
    if (this.div_) {
        this.div_.style.visibility = "visible";
    }
};

/**
 * Hides the InfoBox. [Deprecated; use <tt>setVisible</tt> instead.]
 */
InfoBox.prototype.hide = function () {

    this.isHidden_ = true;
    if (this.div_) {
        this.div_.style.visibility = "hidden";
    }
};

/**
 * Adds the InfoBox to the specified map or Street View panorama. If <tt>anchor</tt>
 *  (usually a <tt>google.maps.Marker</tt>) is specified, the position
 *  of the InfoBox is set to the position of the <tt>anchor</tt>. If the
 *  anchor is dragged to a new location, the InfoBox moves as well.
 * @param {Map|StreetViewPanorama} map
 * @param {MVCObject} [anchor]
 */
InfoBox.prototype.open = function (map, anchor) {


    var me = this;

    if (anchor) {

        this.position_ = anchor.getPosition();
        this.moveListener_ = google.maps.event.addListener(anchor, "position_changed", function () {
            me.setPosition(this.getPosition());
        });
    }

    this.setMap(map);

    if (this.div_) {

        this.panBox_();
    }
};

/**
 * Removes the InfoBox from the map.
 */
InfoBox.prototype.close = function () {

    var i;

    if (this.closeListener_) {

        google.maps.event.removeListener(this.closeListener_);
        this.closeListener_ = null;
    }

    if (this.eventListeners_) {

        for (i = 0; i < this.eventListeners_.length; i++) {

            google.maps.event.removeListener(this.eventListeners_[i]);
        }
        this.eventListeners_ = null;
    }

    if (this.moveListener_) {

        google.maps.event.removeListener(this.moveListener_);
        this.moveListener_ = null;
    }

    if (this.contextListener_) {

        google.maps.event.removeListener(this.contextListener_);
        this.contextListener_ = null;
    }

    this.setMap(null);
};
;
/**
 * @name StyledMarkerMaker
 * @version 0.5
 * @author Gabriel Schneider
 * @copyright (c) 2010 Gabriel Schneider
 * @fileoverview This gives you static functions for creating dynamically
 *     styled markers using Charts API outputs as well as an ability to
 *     extend with custom types.
 */

/**
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var StyledIconTypes = {};
var StyledMarker, StyledIcon;

/**
 * @param {Function} childCtor Child class.
 * @param {Function} parentCtor Parent class.
 */
function inherits(childCtor, parentCtor) {
    /** @constructor */
    function tempCtor() {};
    tempCtor.prototype = parentCtor.prototype;
    childCtor.superClass_ = parentCtor.prototype;
    childCtor.prototype = new tempCtor();
    /** @override */
    childCtor.prototype.constructor = childCtor;
}

(function() {
    var bu_ = 'https://chart.googleapis.com/chart?chst=';
    var gm_ = google.maps;
    var gp_ = gm_.Point;
    var ge_ = gm_.event;
    var gmi_ = gm_.MarkerImage;


    /**
     * This class is an extended version of google.maps.Marker. It allows
     * styles to be applied that change it's appearance.
     * @extends google.maps.Marker
     * @param {StyledMarkerOptions} StyledMarkerOptions The options for the Marker
     */
    StyledMarker = function(styledMarkerOptions) {
        gm_.Marker.call(this);
        var me=this;
        var ci = me.styleIcon = styledMarkerOptions.styleIcon;
        me.bindTo('icon',ci);
        me.bindTo('shadow',ci);
        me.bindTo('shape',ci);
        me.setOptions(styledMarkerOptions);
    };
    inherits(StyledMarker, gm_.Marker);

    /**
     * This class stores style information that can be applied to StyledMarkers.
     * @extends google.maps.MVCObject
     * @param {StyledIconType} styledIconType The type of style this icon is.
     * @param {StyledIconOptions} styledIconOptions The options for this StyledIcon.
     * @param {StyledIcon} styleClass A class to apply extended style information.
     */
    StyledIcon = function(styledIconType,styledIconOptions,styleClass) {
        var k;
        var me=this;
        var i_ = 'icon';
        var sw_ = 'shadow';
        var s_ = 'shape';
        var a_ = [];

        function gs_() {
            var image_ = document.createElement('img');
            var simage_ = document.createElement('img');
            ge_.addDomListenerOnce(simage_, 'load', function() {
                var w = simage_.width, h = simage_.height;
                me.set(sw_,new gmi_(styledIconType.getShadowURL(me),null,null,styledIconType.getShadowAnchor(me,w,h)));
                simage = null;
            });
            ge_.addDomListenerOnce(image_, 'load', function() {
                var w = image_.width, h = image_.height;
                me.set(i_,new gmi_(styledIconType.getURL(me),null,null,styledIconType.getAnchor(me,w,h)));
                me.set(s_,styledIconType.getShape(me,w,h));
                image_ = null;
            });
            image_.src = styledIconType.getURL(me);
            simage_.src = styledIconType.getShadowURL(me);
        }

        /**
         * set:
         * This function sets a given style property to the given value.
         * @param {String} name The name of the property to set.
         * @param {Object} value The value to set the property to.
         * get:
         * This function gets a given style property.
         * @param {String} name The name of the property to get.
         * @return {Object}
         */
        me.as_ = function(v) {
            a_.push(v);
            for(k in styledIconOptions) {
                v.set(k, styledIconOptions[k]);
            }
        }

        if (styledIconType !== StyledIconTypes.CLASS) {
            for (k in styledIconType.defaults) {
                me.set(k, styledIconType.defaults[k]);
            }
            me.setValues(styledIconOptions);
            me.set(i_,styledIconType.getURL(me));
            me.set(sw_,styledIconType.getShadowURL(me));
            if (styleClass) styleClass.as_(me);
            gs_();
            me.changed = function(k) {
                if (k!==i_&&k!==s_&&k!==sw_) {
                    gs_();
                }
            };
        } else {
            me.setValues(styledIconOptions);
            me.changed = function(v) {
                styledIconOptions[v] = me.get(v);
                for (k = 0; k < a_.length; k++) {
                    a_[k].set(v,me.get(v));
                }
            };
            if (styleClass) styleClass.as_(me);
        }
    };
    StyledIcon.prototype = new gm_.MVCObject();

    /**
     * StyledIconType
     * This class holds functions for building the information needed to style markers.
     * getURL:
     * This function builds and returns a URL to use for the Marker icon property.
     * @param {StyledIcon} icon The StyledIcon that holds style information
     * @return {String}
     * getShadowURL:
     * This function builds and returns a URL to use for the Marker shadow property.
     * @param {StyledIcon} icon The StyledIcon that holds style information
     * @return {String{
  * getAnchor:
  * This function builds and returns a Point to indicate where the marker is placed.
  * @param {StyledIcon} icon The StyledIcon that holds style information
     * @param {Number} width The width of the icon image.
     * @param {Number} height The height of the icon image.
     * @return {google.maps.Point}
     * getShadowAnchor:
     * This function builds and returns a Point to indicate where the shadow is placed.
     * @param {StyledIcon} icon The StyledIcon that holds style information
     * @param {Number} width The width of the shadow image.
     * @param {Number} height The height of the shadow image.
     * @return {google.maps.Point}
     * getShape:
     * This function builds and returns a MarkerShape to indicate where the Marker is clickable.
     * @param {StyledIcon} icon The StyledIcon that holds style information
     * @param {Number} width The width of the icon image.
     * @param {Number} height The height of the icon image.
     * @return {google.maps.MarkerShape}
     */

    StyledIconTypes.CLASS = {};

    StyledIconTypes.MARKER = {
        defaults: {
            text:'',
            color:'00ff00',
            fore:'000000',
            starcolor:null
        },
        getURL: function(props){
            var _url;
            var starcolor_=props.get('starcolor');
            var text_=props.get('text');
            var color_=props.get('color').replace(/#/,'');
            var fore_=props.get('fore').replace(/#/,'');
            if (starcolor_) {
                _url = bu_ + 'd_map_xpin_letter&chld=pin_star|';
            } else {
                _url = bu_ + 'd_map_pin_letter&chld=';
            }
            if (text_) {
                text_ = text_.substr(0,2);
            }
            _url+=text_+'|';
            _url+=color_+'|';
            _url+=fore_;
            if (starcolor_) {
                _url+='|'+starcolor_.replace(/#/,'');
            }
            return _url;
        },
        getShadowURL: function(props){
            if (props.get('starcolor')) {
                return bu_ + 'd_map_xpin_shadow&chld=pin_star';
            } else {
                return bu_ + 'd_map_pin_shadow';
            }
        },
        getAnchor: function(props,width,height){
            return new gp_(width / 2,height);
        },
        getShadowAnchor: function(props,width,height){
            return new gp_(width / 4,height);
        },
        getShape: function(props,width,height){
            var _iconmap = {};
            _iconmap.coord = [
                width / 2, height,
                (7 / 16) * width, (5 / 8) * height,
                (5 / 16) * width, (7 / 16) * height,
                (7 / 32) * width, (5 / 16) * height,
                (5 / 16) * width, (1 / 8) * height,
                (1 / 2) * width, 0,
                (11 / 16) * width, (1 / 8) * height,
                (25 / 32) * width, (5 / 16) * height,
                (11 / 16) * width, (7 / 16) * height,
                (9 / 16) * width, (5 / 8) * height
            ];
            for (var i = 0; i < _iconmap.coord.length; i++) {
                _iconmap.coord[i] = Math.round(_iconmap.coord[i]);
            }
            _iconmap.type = 'poly';
            return _iconmap;
        }
    };
    StyledIconTypes.BUBBLE = {
        defaults: {
            text:'',
            color:'00ff00',
            fore:'000000'
        },
        getURL: function(props){
            var _url = bu_ + 'd_bubble_text_small&chld=bb|';
            _url+=props.get('text')+'|';
            _url+=props.get('color').replace(/#/,'')+'|';
            _url+=props.get('fore').replace(/#/,'');
            return _url;
        },
        getShadowURL: function(props){
            return bu_ + 'd_bubble_text_small_shadow&chld=bb|' + props.get('text');
        },
        getAnchor: function(props,width,height){
            return new google.maps.Point(0,42);
        },
        getShadowAnchor: function(props,width,height){
            return new google.maps.Point(0,44);
        },
        getShape: function(props,width,height){
            var _iconmap = {};
            _iconmap.coord = [
                0,44,
                13,26,
                13,6,
                17,1,
                width - 4,1,
                width,6,
                width,21,
                width - 4,26,
                21,26
            ];
            _iconmap.type = 'poly';
            return _iconmap;
        }
    };
})();

;
(function ($) {

$(document).ready(function() {

  // Expression to check for absolute internal links.
  var isInternal = new RegExp("^(https?):\/\/" + window.location.host, "i");

  // Attach onclick event to document only and catch clicks on all elements.
  $(document.body).click(function(event) {
    // Catch the closest surrounding link of a clicked element.
    $(event.target).closest("a,area").each(function() {

      var ga = Drupal.settings.googleanalytics;
      // Expression to check for special links like gotwo.module /go/* links.
      var isInternalSpecial = new RegExp("(\/go\/.*)$", "i");
      // Expression to check for download links.
      var isDownload = new RegExp("\\.(" + ga.trackDownloadExtensions + ")$", "i");

      // Is the clicked URL internal?
      if (isInternal.test(this.href)) {
        // Skip 'click' tracking, if custom tracking events are bound.
        if ($(this).is('.colorbox')) {
          // Do nothing here. The custom event will handle all tracking.
        }
        // Is download tracking activated and the file extension configured for download tracking?
        else if (ga.trackDownload && isDownload.test(this.href)) {
          // Download link clicked.
          var extension = isDownload.exec(this.href);
          _gaq.push(["_trackEvent", "Downloads", extension[1].toUpperCase(), this.href.replace(isInternal, '')]);
        }
        else if (isInternalSpecial.test(this.href)) {
          // Keep the internal URL for Google Analytics website overlay intact.
          _gaq.push(["_trackPageview", this.href.replace(isInternal, '')]);
        }
      }
      else {
        if (ga.trackMailto && $(this).is("a[href^='mailto:'],area[href^='mailto:']")) {
          // Mailto link clicked.
          _gaq.push(["_trackEvent", "Mails", "Click", this.href.substring(7)]);
        }
        else if (ga.trackOutbound && this.href.match(/^\w+:\/\//i)) {
          if (ga.trackDomainMode == 2 && isCrossDomain($(this).attr('hostname'), ga.trackCrossDomains)) {
            // Top-level cross domain clicked. document.location is handled by _link internally.
            event.preventDefault();
            _gaq.push(["_link", this.href]);
          }
          else {
            // External link clicked.
            _gaq.push(["_trackEvent", "Outbound links", "Click", this.href]);
          }
        }
      }
    });
  });

  // Colorbox: This event triggers when the transition has completed and the
  // newly loaded content has been revealed.
  $(document).bind("cbox_complete", function() {
    var href = $.colorbox.element().attr("href");
    if (href) {
      _gaq.push(["_trackPageview", href.replace(isInternal, '')]);
    }
  });

});

/**
 * Check whether the hostname is part of the cross domains or not.
 *
 * @param string hostname
 *   The hostname of the clicked URL.
 * @param array crossDomains
 *   All cross domain hostnames as JS array.
 *
 * @return boolean
 */
function isCrossDomain(hostname, crossDomains) {
  /**
   * jQuery < 1.6.3 bug: $.inArray crushes IE6 and Chrome if second argument is
   * `null` or `undefined`, http://bugs.jquery.com/ticket/10076,
   * https://github.com/jquery/jquery/commit/a839af034db2bd934e4d4fa6758a3fed8de74174
   *
   * @todo: Remove/Refactor in D8
   */
  if (!crossDomains) {
    return false;
  }
  else {
    return $.inArray(hostname, crossDomains) > -1 ? true : false;
  }
}

})(jQuery);
;
