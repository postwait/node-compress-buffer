import Options
from os import unlink, symlink, popen
from os.path import exists 

srcdir = "."
blddir = "build"
VERSION = "0.2.0"

def set_options(opt):
  opt.tool_options("compiler_cxx")

  opt.add_option('--debug', dest='debug', action='store_true', default=False)

def configure(conf):
  conf.check_tool("compiler_cxx")
  conf.check_tool("node_addon")

  conf.env.DEFINES = []
  conf.env.USELIB = []

  if Options.options.debug:
    conf.env.DEFINES += [ 'DEBUG' ]
    conf.env.CXXFLAGS = [ '-O0', '-g3' ]
  else:
    conf.env.CXXFLAGS = [ '-O3' ]


def build(bld):
  obj = bld.new_task_gen("cxx", "shlib", "node_addon")
  obj.cxxflags = ["-D_FILE_OFFSET_BITS=64", "-D_LARGEFILE_SOURCE", "-Wall"]
  obj.target = "compress-buffer"
  obj.source = "src/compress-buffer.cc"
  obj.defines = bld.env.DEFINES
  obj.uselib = bld.env.USELIB

