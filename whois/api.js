
var RouterOSAPI = require('node-routeros').RouterOSAPI


var whois = async (options) => {
  var conn = new RouterOSAPI(options)

  await conn.connect()
  conn.on('error', console.error)

  var [leases, active] = await Promise.all([
    conn.write('/ip/dhcp-server/lease/getall'),
    conn.write('/ip/arp/getall'),
  ])

  conn.close()

  var mac = active.map((lease) => lease['mac-address'])

  return leases
    .filter((lease) => mac.includes(lease['mac-address']))
    .map((lease) => ({
      mac: lease['mac-address'],
      ip: lease.address,
      host: lease['host-name'],
    }))
}

module.exports = {whois}
