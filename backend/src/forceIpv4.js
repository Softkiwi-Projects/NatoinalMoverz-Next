import os from "os";
import dns from "dns";

/**
 * Render container networks do not have outbound IPv6 routing.
 * This module forces IPv4 across all DNS lookups, resolves, and network interfaces,
 * completely preventing Nodemailer from attempting unreachable IPv6 addresses (ENETUNREACH).
 */

// 1. Force Node's default resolver order
dns.setDefaultResultOrder("ipv4first");

// 2. Override resolve6 so Nodemailer never discovers or picks IPv6 addresses
dns.resolve6 = (hostname, options, callback) => {
  const cb = typeof options === "function" ? options : callback;
  if (typeof cb === "function") cb(null, []);
};

if (dns.promises) {
  dns.promises.resolve6 = async () => [];
}

if (dns.Resolver && dns.Resolver.prototype) {
  dns.Resolver.prototype.resolve6 = function (hostname, options, callback) {
    const cb = typeof options === "function" ? options : callback;
    if (typeof cb === "function") cb(null, []);
  };
}

// 3. Override dns.lookup to enforce family: 4
const _origLookup = dns.lookup;
dns.lookup = (hostname, options, callback) => {
  let cb = callback;
  let opts = options;
  if (typeof options === "function") {
    cb = options;
    opts = {};
  } else if (typeof options === "number") {
    opts = { family: options };
  }
  opts = Object.assign({}, opts, { family: 4 });
  return _origLookup(hostname, opts, cb);
};

// 4. Filter os.networkInterfaces so Nodemailer isFamilySupported(6) evaluates to false
try {
  const _origNetworkInterfaces = os.networkInterfaces;
  os.networkInterfaces = () => {
    const ifaces = _origNetworkInterfaces();
    const ipv4Only = {};
    for (const [name, addrs] of Object.entries(ifaces)) {
      ipv4Only[name] = (addrs || []).filter((a) => a.family === "IPv4" || a.family === 4);
    }
    return ipv4Only;
  };
} catch {
  // Ignore in restricted environments
}
