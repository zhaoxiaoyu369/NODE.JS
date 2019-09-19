#!/usr/bin/node
const pi = Math.PI;
/**
 *  * 计算圆的直径
 *   *
 *    * @param radius {number} 圆的半径
 *     * @returns {number} 圆的直径
 *      */
 
module.exports.diameter = (radius) => 2 * radius;
/**
 *  * 计算圆的周长
 *   *
 *    * @param radius {number} 圆的半径
 *     * @returns {number} 圆的周长
 *      */


module.exports.circumference = (radius) => pi * 2 * radius;
/**
 *  * 计算圆的面积
 *   *
 *    * @param radius {number} 圆的半径
 *     * @returns {number} 圆的面积
 *      */

module.exports.area = (radius) => pi * radius * radius;

console.dir(module);
